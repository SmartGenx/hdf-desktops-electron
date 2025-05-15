import { PrismaClient, Applicant, Prisma } from '@prisma/client';
import DatabaseError from '../../errors/DatabaseError';
import NotFoundError from '../../errors/NotFoundError';
import { v4 as uuidv4 } from 'uuid';
import { convertTopLevelStringBooleans } from '../../utilty/convertTopLevelStringBooleans';
import { convertStringNumbers } from '../../utilty/convertToInt';
import { convertEqualsToInt } from '../../utilty/convertToInt'
import { ApplicantByDirectorateViewModel } from '../../viewModels/ApplicantByDirectorateViewModel';
import { ApplicantByCategoryViewModel } from '../../viewModels/ApplicantByCategoryViewModel';

interface DataFilter {
  page?: number
  pageSize?: number
  include?: Record<string, string | boolean>
  orderBy?: Prisma.ApplicantOrderByWithRelationInput
  [key: string]: any
}
interface MonthlyCount {
  month: number
  males: number
  females: number
}

interface SquareCount {
  name: string
  count: number
}
export interface ApplicantGenderStats {
  monthlyCounts: MonthlyCount[]
  result: SquareCount[]
  accreditCount: number
}

interface DismissalSummary {
  totalAmount: number
  approvedAmount: number
}

interface ApplicantInfo {
  name: string
  gender: string
  phoneNumber: string
  numberOfRfid: number
}
export default class ApplicantService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async getAllApplicants(dataFilter: any) {
    try {
      const { page, pageSize, include: rawInclude, orderBy, ...filters } = dataFilter;
      const include = rawInclude ? convertTopLevelStringBooleans(rawInclude) : {};
      const where = filters ? convertStringNumbers(filters) : {};

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const applicant = await this.prisma.applicant.findMany({
          where: { ...where, deleted: false, accredited: false },
          include,
          skip,
          take,
          orderBy
        });
        const total = await this.prisma.applicant.count({
          where: { ...where, deleted: false, accredited: false }
        });
        return { info: applicant, total, page, pageSize };
      }
      return await this.prisma.applicant.findMany({
        where: { ...where, deleted: false, accredited: false },
        include,
        orderBy
      });
    } catch (error) {
      throw new DatabaseError('Error retrieving applicants.', error);
    }
  }

  async getAllApplicantsUseUpdate(dataFilter: DataFilter): Promise<
  | {
      info: Applicant[]
      total: number
      page: number
      pageSize: number
    }
  | Applicant[]
    > {
  try {
    const page = dataFilter.page
    const pageSize = dataFilter.pageSize
    delete dataFilter.page
    delete dataFilter.pageSize

    let include: Prisma.ApplicantInclude = {}
    if (dataFilter.include) {
      include = convertTopLevelStringBooleans(dataFilter.include)
      delete dataFilter.include
    }

    const orderBy = dataFilter.orderBy ?? { createdAt: 'desc' }
    delete dataFilter.orderBy

    const where: Prisma.ApplicantWhereInput = {
      ...convertEqualsToInt(dataFilter),
      deleted: false,
    }

    if (page && pageSize) {
      const skip = (page - 1) * pageSize
      const take = pageSize

      const [applicants, total] = await Promise.all([
        this.prisma.applicant.findMany({
          where,
          include,
          orderBy,
          skip,
          take,
        }),
        this.prisma.applicant.count({ where }),
      ])

      return {
        info: applicants,
        total,
        page,
        pageSize,
      }
    }

    return await this.prisma.applicant.findMany({
      where,
      include,
      orderBy,
    })
  } catch (error) {
    throw new DatabaseError('Error retrieving applicants.', error)
  }
  }

  async countAllApplicants(): Promise<number> {
    try {
      const count = await this.prisma.applicant.count({
        where: {
          accredited: false,
          deleted: false,
        },
      })
      return count
    } catch (error) {
      throw new DatabaseError('Error counting applicants.', error)
    }
  }

  async getApplicantMonthlyGenderCounts(): Promise<ApplicantGenderStats> {
    try {
      const accredited = await this.prisma.accredited.findMany({
        where: {
          deleted: false,
        },
        include: {
          applicant: {
            select: {
              gender: true,
              submissionDate: true,
            },
          },
        },
      })

      const malesCounts = new Array(12).fill(0)
      const femalesCounts = new Array(12).fill(0)

      accredited.forEach((item) => {
        const submissionDate = item.applicant?.submissionDate
        const gender = item.applicant?.gender

        if (submissionDate) {
          const month = submissionDate.getMonth() // 0 to 11
          if (gender === 'M') {
            malesCounts[month]++
          } else if (gender === 'F') {
            femalesCounts[month]++
          }
        }
      })

      const monthlyCounts: MonthlyCount[] = malesCounts.map((maleCount, index) => ({
        month: index + 1,
        males: maleCount,
        females: femalesCounts[index],
      }))

      const getAccreditBySquare = await this.prisma.square.findMany({
        where: {
          deleted: false,
        },
        select: {
          name: true,
          _count: {
            select: {
              Accredited: true,
            },
          },
        },
      })

      const result: SquareCount[] = getAccreditBySquare.map((square) => ({
        name: square.name,
        count: square._count.Accredited,
      }))

      const accreditCount = await this.prisma.accredited.count({
        where: {
          deleted: false,
        },
      })

      return {
        monthlyCounts,
        result,
        accreditCount,
      }
    } catch (error) {
      throw new DatabaseError('Failed to fetch applicant monthly gender counts', error)
    }
  }

  async getApplicantById(id: string) {
    try {
      const applicant = await this.prisma.applicant.findUnique({
        where: { globalId: id },
        include: {
          category: true,
          directorate: true,
          diseasesApplicants: true,
        }
      });
      if (!applicant) throw new NotFoundError(`Applicant with id ${id} not found.`);
      return applicant;
    } catch (error) {
      throw new DatabaseError('Error retrieving applicant.', error);
    }
  }

  async createApplicant(ApplicantData: any) {
    try {
      const timestamp = Date.now();
      const uniqueId = uuidv4();
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;
      const { diseaseGlobalId, ...rest } = ApplicantData;

      const applicant = await this.prisma.applicant.create({
        data: {
          ...rest,
          globalId
        }
      });

      if (applicant) {
        const diseaseRecordId = `${process.env.LOCAL_DB_ID}-${uuidv4()}-${Date.now()}`;
        const link = await this.prisma.diseasesApplicants.create({
          data: {
            diseaseGlobalId,
            applicantGlobalId: applicant.globalId,
            globalId: diseaseRecordId,
            deleted: false
          }
        });
        return link ? applicant : null;
      }
    } catch (error) {
      throw new DatabaseError('Error creating applicant.', error);
    }
  }

  async updateApplicant(id: string, ApplicantData: any) {
    try {
      const { diseaseGlobalId } = ApplicantData;
      delete ApplicantData.diseaseGlobalId;

      const existingApplicant = await this.prisma.applicant.findUnique({ where: { globalId: id } });
      if (!existingApplicant) throw new NotFoundError(`Applicant with id ${id} not found.`);

      const updated = await this.prisma.applicant.update({
        where: { globalId: id },
        data: { ...ApplicantData, version: { increment: 1 } }
      });

      const existingDisease = await this.prisma.diseasesApplicants.findFirst({
        where: {
          applicantGlobalId: existingApplicant.globalId,
          diseaseGlobalId
        }
      });

      if (!existingDisease) throw new NotFoundError('Disease record not found for this applicant.');

      await this.prisma.diseasesApplicants.update({
        where: { globalId: existingDisease.globalId },
        data: {
          diseaseGlobalId,
          applicantGlobalId: existingApplicant.globalId,
          version: { increment: 1 }
        }
      });

      return updated;
    } catch (error) {
      throw new DatabaseError('Error updating applicant.', error);
    }
  }

  async updateApplicantAccredited(id: string): Promise<Applicant> {
    try {
      const existingApplicant = await this.prisma.applicant.findUnique({
        where: { globalId: id },
      })

      if (!existingApplicant) {
        throw new NotFoundError(`Applicant with id ${id} not found.`)
      }

      // Update accredited status and increment version
      await this.prisma.applicant.update({
        where: { globalId: id },
        data: {
          accredited: true,
          version: { increment: 1 },
        },
      })

      // Delete the applicant (soft delete not used here)
      return await this.prisma.applicant.delete({
        where: { globalId: id },
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating and deleting applicant.', error)
    }
  }

  async deleteApplicant(id: string) {
    try {
      const applicant = await this.prisma.applicant.findUnique({ where: { globalId: id } });
      if (!applicant) throw new NotFoundError(`Applicant with id ${id} not found.`);

      return await this.prisma.applicant.update({
        where: { globalId: id },
        data: { deleted: true, version: { increment: 1 } }
      });
    } catch (error) {
      throw new DatabaseError('Error deleting applicant.', error);
    }
  }

  async getApplicantReportByDirectorate(directorateId: number): Promise<ApplicantByDirectorateViewModel[]> {
    try {
      const accreditedList = await this.prisma.accredited.findMany({
        where: {
          applicant: {
            directorate: {
              id: directorateId,
            },
          },
        },
        include: {
          dismissal: true,
          applicant: {
            include: {
              directorate: true,
              category: true,
              diseasesApplicants: {
                include: {
                  Disease: true,
                },
              },
            },
          },
        },
      })

      const reports = accreditedList.map((accredited) => {
        const applicant = accredited.applicant
        const state = accredited.state
        const namedDirectorate = applicant.directorate.name
        const nameCategory = `${applicant.category.SupportRatio}%`

        const diseaseNames = applicant.diseasesApplicants
          .map((da) => da.Disease.name)
          .join(', ')

        const totalAmount = accredited.dismissal
          .map((d) => d.totalAmount)
          .reduce((acc, curr) => acc + curr, 0)

        const approvedAmount = accredited.dismissal
          .map((d) => d.approvedAmount)
          .reduce((acc, curr) => acc + curr, 0)

        const createdAt = accredited.createdAt // 👈 أو أي تاريخ تود استخدامه
        const month = createdAt.toLocaleString('default', { month: 'long' }) // مثال: "January"
        const year = createdAt.getFullYear()

        return new ApplicantByDirectorateViewModel(
          applicant,
          diseaseNames,
          namedDirectorate,
          state,
          { totalAmount, approvedAmount },
          nameCategory,
          month,
          year
        )
      })

      return reports
    } catch (error) {
      throw new DatabaseError('Error retrieving applicant report by directorate.', error)
    }
  }

  async getAllAccreditedAfterDismissal(filterParams: any): Promise<any> {
    const page = filterParams?.page;
    const pageSize = filterParams?.pageSize;
    // Remove pagination from filterParams
    delete filterParams?.page;
    delete filterParams?.pageSize;
    if (page && pageSize) {
      const skip = (+page - 1) * +pageSize;
      const take = +pageSize;
      try {
        const dismissal = await this.prisma.dismissal.findMany({
          where: filterParams,
          include: {
            Accredited: {
              include: {
                square: true,
                applicant: {
                  include: {
                    directorate: true,
                    category: true,
                    diseasesApplicants: {
                      include: {
                        Disease: true
                      }
                    }
                  }
                }
              }
            }
          },
          skip: skip,
          take: take
        });
        const total = await this.prisma.dismissal.count({
          where: filterParams
        });
        const reports = dismissal.map((dismissalItem: any) => {
          const applicant = {
            name: dismissalItem.Accredited.applicant.name,
            gender: dismissalItem.Accredited.applicant.gender,
            phoneNumber: dismissalItem.Accredited.applicant.phoneNumber,
            numberOfRfid: dismissalItem.Accredited.applicant.phoneNumber
          };
          const Month = dismissalItem.month;
          const year = dismissalItem.year;
          console.log('🚀 ~ ApplicantService ~ reports ~ Month:', Month);
          const state = dismissalItem.Accredited.state;
          const Namedirectorate = dismissalItem.Accredited.applicant.directorate.name;
          const Namecategory = dismissalItem.Accredited.applicant.category.SupportRatio + '%';
          const dismissals = {
            totalAmount: dismissalItem.totalAmount,
            approvedAmount: dismissalItem.amountPaid
          };
          return new ApplicantByDirectorateViewModel(
            applicant,
            dismissalItem.Accredited.applicant.diseasesApplicants
              .map((da: any) => da.Disease.name)
              .join(', '),
            Namedirectorate,
            state,
            dismissals,
            Namecategory,
            Month,
            year
          );
        });

        return {
          info: reports,
          total: total,
          page: page,
          pageSize: pageSize
        };
      } catch (error) {
        throw new DatabaseError('Error deleting accreditation.', error);
      }
    } else {
      const dismissal = await this.prisma.dismissal.findMany({
        where: filterParams,
        include: {
          Accredited: {
            include: {
              square: true,
              applicant: {
                include: {
                  directorate: true,
                  category: true,
                  diseasesApplicants: {
                    include: {
                      Disease: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      const reports = dismissal.map((dismissalItem: any) => {
        const applicant = {
          name: dismissalItem.Accredited.applicant.name,
          gender: dismissalItem.Accredited.applicant.gender,
          phoneNumber: dismissalItem.Accredited.applicant.phoneNumber,
          numberOfRfid: dismissalItem.Accredited.applicant.phoneNumber
        };
        const Month = dismissalItem.month;
        const year = dismissalItem.year;
        const state = dismissalItem.Accredited.state;
        const Namedirectorate = dismissalItem.Accredited.applicant.directorate.name;
        const Namecategory = dismissalItem.Accredited.applicant.category.SupportRatio + '%';
        const diseaseNames = dismissalItem.Accredited.applicant.diseasesApplicants
          .map((da: any) => da.Disease.name)
          .join(', ');
        const dismissals = {
          totalAmount: dismissalItem.totalAmount,
          approvedAmount: dismissalItem.amountPaid
        };
        return new ApplicantByDirectorateViewModel(
          applicant,
          diseaseNames,
          Namedirectorate,
          state,
          dismissals,
          Namecategory,
          Month,
          year
        );
      });
      return reports;
    }
  }

  async ApplicantByCategory(applicantfilter: any): Promise<any> {
    try {
      const page = applicantfilter?.page;
      const pageSize = applicantfilter?.pageSize;
      delete applicantfilter?.page;
      delete applicantfilter?.pageSize;

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize;
        const take = +pageSize;
        const Applicant = await this.prisma.applicant.findMany({
          where: {
            ...applicantfilter,
            accredited: false,
            deleted: false
          },
          include: {
            directorate: true,
            category: true,
            diseasesApplicants: {
              include: {
                Disease: true
              }
            }
          },
          skip: skip,
          take: take
        });
        const total = await this.prisma.applicant.count({
          where: {
            ...applicantfilter,
            accredited: false,
            deleted: false
          }
        });
        const reports = Applicant.map((Applican: any) => {
          const applicant = {
            name: Applican.name,
            submissionDate: Applican.submissionDate.toISOString().split('T')[0],
            phoneNumber: Applican.phoneNumber
          };
          const categoryName = Applican.category.name;
          const Namedirectorate = Applican.directorate.name;
          const diseaseNames = Applican.diseasesApplicants
            .map((da: any) => da.Disease.name)
            .join(', ');
          return new ApplicantByCategoryViewModel(
            applicant,
            diseaseNames,
            Namedirectorate,
            categoryName
          );
        });

        return {
          info: reports,
          total: total,
          page: page,
          pageSize: pageSize
        };
      } else {
        const Applicant = await this.prisma.applicant.findMany({
          where: {
            ...applicantfilter,
            accredited: false,
            deleted: false
          },
          include: {
            directorate: true,
            category: true,
            diseasesApplicants: {
              include: {
                Disease: true
              }
            }
          }
        });
        const reports = Applicant.map((Applican: any) => {
          const applicant = {
            name: Applican.name,
            submissionDate: Applican.submissionDate.toISOString().split('T')[0],
            phoneNumber: Applican.phoneNumber
          };
          const categoryName = Applican.category.name;
          const Namedirectorate = Applican.directorate.name;
          const diseaseNames = Applican.diseasesApplicants
            .map((da: any) => da.Disease.name)
            .join(', ');
          return new ApplicantByCategoryViewModel(
            applicant,
            diseaseNames,
            Namedirectorate,
            categoryName
          );
        });
        return reports;
      }
    } catch (error) {
      console.error('Error fetching applicant report:', error);
      throw new DatabaseError('Error deleting accreditation.', error);
    }
  }
}
