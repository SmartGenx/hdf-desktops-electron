// AccreditedService.ts
import { Accredited, Applicant, Prescription, Prisma, PrismaClient } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import {ValidationError} from '../../errors/ValidationError';
import {convertStringNumbers} from '../../utilty/convertToInt';
import {convertTopLevelStringBooleans} from '../../utilty/convertTopLevelStringBooleans';
import { v4 as uuidv4 } from 'uuid';
import { AccreditedByPrescription } from '../../viewModels/AccreditedByPrescription';

interface CreateAccreditedInput {
  numberOfRfid: number | string
  formNumber: number | string
  type: string
  prescriptionDate: Date
  applicantGlobalId: string
  pharmacyGlobalId: string
  squareGlobalId?: string
  treatmentSite: string
  doctor: string
  state: string
  [key: string]: any
}

interface UpdateAccreditedInput {
  type?: string
  numberOfRfid?: number | string
  formNumber?: number | string
  prescriptionDate?: Date
  treatmentSite?: string
  doctor?: string
  state?: string
  [key: string]: any
}

interface DataFilter {
  page?: number
  pageSize?: number
  orderBy?: Prisma.AccreditedOrderByWithRelationInput
  [key: string]: any
}
interface DiseaseWithCheck {
  globalId: string
  name: string
  cheacked: boolean
}

interface SquareWithCheck {
  globalId: string
  name: string
  cheacked: boolean
}

interface PrintAccreditationResult extends Accredited {
  applicant: {
    name: string
    phoneNumber: string
    state: string
    directorateName: string
    governorateName: string
    categoryName: string
    diseasesApplicants: DiseaseWithCheck[]
    [key: string]: any
  }
  square: SquareWithCheck[]
}


export default class AccreditedService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async searchAccreditations(dataFilter: any) {
    const getDateMonthsFromNow = (months: number) => {
      const currentDate = new Date();
      currentDate.setMonth(currentDate.getMonth() + months);
      return currentDate;
    };
    const currentDate = getDateMonthsFromNow(0);

    try {
      const accreditations = await this.prisma.accredited.findMany({
        include: {
          applicant: {
            include: {
              diseasesApplicants: {
                include: {
                  Disease: true,
                },
              },
            },
          },
          square: true,
          dismissal: {
            orderBy: { id: 'desc' },
            take: 1,
          },
        },
      });

      for (const accredited of accreditations) {
        if (accredited.state === 'موقف') continue;

        const prescriptions = await this.prisma.prescription.findFirst({
          where: { accreditedGlobalId: accredited.globalId },
        });

        const dismissal = await this.prisma.dismissal.findFirst({
          where: { accreditedGlobalId: accredited.globalId },
          orderBy: { id: 'desc' },
        });

        const dismissalDate = dismissal?.dateToDay ? new Date(dismissal.dateToDay) : null;
        const renewalDate = prescriptions?.renewalDate ? new Date(prescriptions.renewalDate) : null;

        if (!renewalDate && !dismissalDate) continue;

        const threeMonthsFromRenewal = renewalDate ? new Date(renewalDate.setMonth(renewalDate.getMonth() + 3)) : null;
        const threeMonthsFromDismissal = dismissalDate ? new Date(dismissalDate.setMonth(dismissalDate.getMonth() + 3)) : null;

        let newState: string | undefined;

        if (renewalDate && threeMonthsFromRenewal && threeMonthsFromRenewal < currentDate) {
          newState = 'موقف';
        } else if (dismissalDate && threeMonthsFromDismissal && threeMonthsFromDismissal < currentDate) {
          newState = 'موقف';
        } else if (renewalDate && renewalDate < currentDate) {
          newState = 'منتهي';
        } else if (renewalDate && renewalDate >= currentDate) {
          newState = 'مستمر';
        }

        if (newState) {
          await this.prisma.accredited.update({
            where: { globalId: accredited.globalId },
            data: {
              state: newState,
              version: { increment: 1 },
            },
          });
        }
      }

      const { page, pageSize, include: inc, orderBy: ord, ...restFilters } = dataFilter;
      const include = inc ? convertTopLevelStringBooleans(inc) : {};
      const orderBy = ord || {};
      const filters = convertStringNumbers(restFilters);

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;

        const accredited = await this.prisma.accredited.findMany({
          where: { ...filters, deleted: false },
          include,
          skip,
          take,
          orderBy,
        });

        const total = await this.prisma.accredited.count({
          where: { ...filters, deleted: false },
        });

        return { info: accredited, total, page, pageSize };
      }

      return await this.prisma.accredited.findMany({
        where: { ...filters, deleted: false },
        include,
        orderBy,
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving accreditations.', error);
    }
  }

  async filterAccreditedByDateAndLocation(
    squareId?: number,
    location?: string,
    doctor?: string,
    state?: number
  ): Promise<Accredited[]> {
    try {
      const whereClause: any = {}

      if (squareId !== undefined) {
        whereClause.squareId = squareId
      }
      if (doctor !== undefined) {
        whereClause.doctor = doctor
      }
      if (state !== undefined) {
        whereClause.state = state
      }
      if (location !== undefined) {
        whereClause.treatmentSite = location
      }

      const accredited = await this.prisma.accredited.findMany({
        where: whereClause,
      })

      return accredited
    } catch (error) {
      throw new DatabaseError('Error retrieving filtered accredited records.', error)
    }
  }

  async getAllAccreditations(dataFilter: any): Promise<
    | { info: Accredited[]; total: number; page: number; pageSize: number }
    | Accredited[]
  > {
    try {
      const { page, pageSize, include, orderBy, ...rest } = dataFilter

      const where: Prisma.AccreditedWhereInput = {
        ...rest,
      }

      const includeObj: Prisma.AccreditedInclude = {}
      if (include?.applicant) includeObj.applicant = true
      if (include?.square) includeObj.square = true
      if (include?.pharmacy) includeObj.pharmacy = true
      if (include?.attachment) includeObj.attachment = true
      if (include?.dismissal) includeObj.dismissal = true
      if (include?.prescription) includeObj.prescription = true

      const finalOrderBy: Prisma.AccreditedOrderByWithRelationInput = {
        formNumber: 'asc',
        ...(orderBy || {}),
      }

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize

        const accredited = await this.prisma.accredited.findMany({
          where,
          include: includeObj,
          orderBy: finalOrderBy,
          skip,
          take,
        })

        const total = await this.prisma.accredited.count({ where })

        return { info: accredited, total, page: +page, pageSize: +pageSize }
      }

      return await this.prisma.accredited.findMany({
        where,
        include: includeObj,
        orderBy: finalOrderBy,
      })
    } catch (error) {
      throw new DatabaseError('Error searching accreditations.', error)
    }
  }

  async getAccreditationById(id: string): Promise<Accredited | null> {
    try {
      const accreditation = await this.prisma.accredited.findUnique({
        where: { globalId: id },
        include: {
          applicant: {
            select: {
              name: true,
            },
          },
          prescription: {
            orderBy: { prescriptionDate: 'desc' },
            take: 1,
          },
          attachment: true,
        },
      })

      if (!accreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`)
      }

      return accreditation
    } catch (error) {
      throw new DatabaseError('Error retrieving accreditation.', error)
    }
  }

  async countAllAccredited(): Promise<number> {
    try {
      // Count all Accredited records where "deleted" is false
      const accreditedCount = await this.prisma.accredited.count({
        where: {
          deleted: false,
        },
      })
      return accreditedCount
    } catch (error) {
      console.error('Error counting accredited records:', error)
      throw new Error('Failed to count accredited records')
    }
  }

  async createAccreditation(
    AccreditedData: CreateAccreditedInput,
    fileAtch: string,
    filePt: string
  ): Promise<Accredited> {
    const transaction = await this.prisma.$transaction(async (prisma) => {
      try {
        const timestamp = Date.now()
        const uniqueId = uuidv4()
        const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`

        const {
          numberOfRfid,
          formNumber,
          type,
          prescriptionDate,
          applicantGlobalId,
          pharmacyGlobalId,
          squareGlobalId,
          ...rest
        } = AccreditedData

        const accredited = await prisma.accredited.create({
          data: {
            numberOfRfid: +numberOfRfid,
            formNumber: +formNumber,
            globalId,
            applicantGlobalId,
            pharmacyGlobalId,
            squareGlobalId,
            ...rest,
          },
        })

        await prisma.attachment.create({
          data: {
            type,
            accreditedGlobalId: accredited.globalId,
            attachmentFile: fileAtch,
            globalId: `${process.env.LOCAL_DB_ID}-${uuidv4()}-${new Date().toISOString()}`,
          },
        })

        const renewalDate = new Date()
        renewalDate.setMonth(renewalDate.getMonth() + 6)

        await prisma.prescription.create({
          data: {
            prescriptionDate,
            renewalDate,
            attachedUrl: filePt,
            accreditedGlobalId: accredited.globalId,
            globalId: `${process.env.LOCAL_DB_ID}-${uuidv4()}-${new Date().toISOString()}`,
          },
        })

        await prisma.applicant.update({
          where: { globalId: applicantGlobalId },
          data: { accredited: true },
        })

        return accredited
      } catch (error) {
        throw new DatabaseError('Error updating accreditation.', error)
      }
    })

    return transaction
  }

  async updateAccreditation(
    id: string,
    AccreditedData: UpdateAccreditedInput,
    fileAtch?: string,
    filePt?: string
  ): Promise<Accredited> {
    try {
      const timestamp = Date.now()
      const uniqueId = uuidv4()
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`

      const {
        type,
        numberOfRfid,
        formNumber,
        prescriptionDate,
        ...rest
      } = AccreditedData

      const accreditExisting = await this.prisma.accredited.findFirst({
        where: { globalId: id },
      })

      if (!accreditExisting) {
        throw new DatabaseError(`Accreditation with id ${id} not found.`)
      }

      const accredited = await this.prisma.accredited.update({
        where: { globalId: id },
        data: {
          numberOfRfid: numberOfRfid ? +numberOfRfid : accreditExisting.numberOfRfid,
          formNumber: formNumber ? +formNumber : accreditExisting.formNumber,
          ...rest,
        },
      })

      if (fileAtch && type) {
        const attachment = await this.prisma.attachment.findFirst({
          where: { accreditedGlobalId: accredited.globalId },
        })

        if (attachment) {
          await this.prisma.attachment.update({
            where: { globalId: attachment.globalId },
            data: {
              type,
              accreditedGlobalId: accredited.globalId,
              attachmentFile: fileAtch,
              version: { increment: 1 },
            },
          })
        }
      }

      if (filePt && prescriptionDate) {
        const prescription = await this.prisma.prescription.findFirst({
          where: { accreditedGlobalId: accredited.globalId },
        })

        if (prescription) {
          const renewalDate = new Date(prescriptionDate)
          renewalDate.setMonth(renewalDate.getMonth() + 6)

          await this.prisma.prescription.update({
            where: { globalId: prescription.globalId },
            data: {
              prescriptionDate,
              renewalDate,
              attachedUrl: filePt,
              accreditedGlobalId: accredited.globalId,
              version: { increment: 1 },
            },
          })
        }
      }

      return accredited
    } catch (error) {
      throw new DatabaseError('Error updating accreditation.', error)
    }
  }

  async updateAccreditationState(id: string, state: string): Promise<Accredited> {
    try {
      const existingAccreditation = await this.prisma.accredited.findUnique({
        where: { globalId: id },
      })

      if (!existingAccreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`)
      }

      return await this.prisma.accredited.update({
        where: { globalId: id },
        data: {
          state,
        },
      })
    } catch (error) {
      throw new DatabaseError('Error updating accreditation.', error)
    }
  }

  async deleteAccreditation(id: string): Promise<string | null> {
    try {
      // Attempt to find the accreditation by globalId
      const accreditation = await this.prisma.accredited.findUnique({
        where: { globalId: id },
        include: {
          applicant: {
            select: {
              name: true,
            },
          },
        },
      })

      // If not found, throw a NotFoundError
      if (!accreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`)
      }

      const applicantName = accreditation.applicant?.name ?? null

      // Soft delete: mark as deleted and increment version
      await this.prisma.accredited.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 },
        },
      })

      return applicantName
    } catch (error) {
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async AccreditedByPrescriptionServer(
    dataFilter: DataFilter
  ): Promise<
    | { info: AccreditedByPrescription[]; total: number; page: number; pageSize: number }
    | AccreditedByPrescription[]
  > {
    try {
      const { page, pageSize, orderBy, ...filters } = dataFilter

      const baseQuery: Prisma.AccreditedFindManyArgs = {
        where: { ...filters },
        include: {
          prescription: true,
          applicant: {
            include: {
              directorate: true,
              diseasesApplicants: {
                include: {
                  Disease: true,
                },
              },
            },
          },
        },
        orderBy: {
          formNumber: 'asc',
          ...(orderBy ?? {}),
        },
      }

      const fullType = (accreditedList: any) =>
        accreditedList as (Accredited & {
          applicant: Applicant & {
            directorate: { name: string }
            diseasesApplicants: { Disease: { name: string } }[]
          }
          prescription: Prescription[]
        })[]

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize

        const accreditedList = await this.prisma.accredited.findMany({
          ...baseQuery,
          skip,
          take,
        })

        const total = await this.prisma.accredited.count({
          where: baseQuery.where,
        })

        const reports = fullType(accreditedList).map(this.mapToReport)

        return {
          info: reports,
          total,
          page,
          pageSize,
        }
      } else {
        const accreditedList = await this.prisma.accredited.findMany(baseQuery)
        return fullType(accreditedList).map(this.mapToReport)
      }
    } catch (error) {
      throw new DatabaseError('Error fetching accreditation data.', error)
    }
  }

  private mapToReport(
    accredited: Accredited & {
      applicant: Applicant & {
        directorate: { name: string }
        diseasesApplicants: { Disease: { name: string } }[]
      }
      prescription: Prescription[]
    }
  ): AccreditedByPrescription {
    const applicant = {
      name: accredited.applicant.name,
      phoneNumber: accredited.applicant.phoneNumber,
      state: accredited.state,
      formNumber: accredited.formNumber,
    }

    const namedDirectorate = accredited.applicant.directorate.name

    const diseaseNames = accredited.applicant.diseasesApplicants
      .map((da) => da.Disease.name)
      .join(', ')

    const sortedPrescriptions = accredited.prescription.sort(
      (a, b) => new Date(a.prescriptionDate).getTime() - new Date(b.prescriptionDate).getTime()
    )

    const latestPrescription = sortedPrescriptions.at(-1)

    const latestPrescriptionDate = latestPrescription
      ? new Date(latestPrescription.prescriptionDate)
      : null

    const renewalDate = latestPrescription
      ? new Date(latestPrescription.renewalDate)
      : null

    const days =
      latestPrescriptionDate && renewalDate
        ? this.calculateDaysBetweenDates(latestPrescriptionDate, renewalDate)
        : 0

    const months =
      latestPrescriptionDate && renewalDate
        ? this.calculateMonthsBetweenDates(latestPrescriptionDate, renewalDate)
        : 0

    return new AccreditedByPrescription(
      applicant,
      accredited.formNumber?.toString() ?? "",
      diseaseNames,
      namedDirectorate,
      {
        latestPrescriptionDate,
        renewalDate,
      },
      days,
      months.toString()
    )
  }

  private calculateDaysBetweenDates(date1: Date, date2: Date): number {
    const diff = date2.getTime() - date1.getTime()
    return Math.round(diff / (1000 * 60 * 60 * 24))
  }

  private calculateMonthsBetweenDates(date1: Date, date2: Date): number {
    if (date1 > date2) return 0
    return (date2.getFullYear() - date1.getFullYear()) * 12 +
           (date2.getMonth() - date1.getMonth())
  }

  async getPrintAccreditationById(id: string): Promise<PrintAccreditationResult> {
    try {
      const [allDiseases, allSquares, accreditation] = await Promise.all([
        this.prisma.disease.findMany({ where: { deleted: false } }),
        this.prisma.square.findMany({ where: { deleted: false } }),
        this.prisma.accredited.findUnique({
          where: { globalId: id },
          include: {
            applicant: {
              include: {
                directorate: { include: { Governorate: true } },
                category: true,
                diseasesApplicants: {
                  include: { Disease: true },
                  where: { deleted: false },
                },
              },
            },
            square: true,
            pharmacy: { include: { Governorate: true } },
            prescription: {
              orderBy: { prescriptionDate: 'desc' },
              take: 1,
            },
          },
        }),
      ])

      if (!accreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`)
      }

      const processedDiseases: DiseaseWithCheck[] = allDiseases.map((d) => ({
        globalId: d.globalId,
        name: d.name,
        cheacked: accreditation.applicant.diseasesApplicants.some(
          (da) => da.Disease.globalId === d.globalId
        ),
      }))

      const processedSquares: SquareWithCheck[] = allSquares.map((s) => ({
        globalId: s.globalId,
        name: s.name,
        cheacked: accreditation.square?.globalId === s.globalId,
      }))

      const diseasesChecked = processedDiseases.filter((d) => d.cheacked)
      const squaresChecked = processedSquares.filter((s) => s.cheacked)

      const diseasesFirst3False = processedDiseases
        .filter((d) => !d.cheacked)
        .slice(0, 3)
      const squaresFirst3False = processedSquares
        .filter((s) => !s.cheacked)
        .slice(0, 3)

      const diseasesResult = [...diseasesChecked, ...diseasesFirst3False]
      const squaresResult = [...squaresChecked, ...squaresFirst3False]

      return {
        ...accreditation,
        applicant: {
          ...accreditation.applicant,
          directorateName: accreditation.applicant.directorate.name,
          governorateName:
            accreditation.applicant.directorate.Governorate.name,
          categoryName: accreditation.applicant.category.name,
          diseasesApplicants: diseasesResult,
        },
        square: squaresResult,
      }
    } catch (error) {
      throw new DatabaseError('Error retrieving accreditation.', error)
    }
  }  
}
