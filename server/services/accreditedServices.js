const DatabaseError = require('../errors/DatabaseError')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')
const AccreditedByPrescription = require('../viewModels/AccreditedByPrescription')
const { v4: uuidv4 } = require('uuid')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')
const { info } = require('console')
const { console } = require('inspector')

// Promisify fs methods to use async/await

class AccreditedService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async searchAccreditations(dataFilter) {
    function getDateMonthsFromNow(months) {
      let currentDate = new Date()
      let newDate = new Date(currentDate)
      newDate.setMonth(currentDate.getMonth() + months)
      return newDate
    }
  
    const currentDate = getDateMonthsFromNow(0)
  
    try {
      const accreditations = await this.prisma.accredited.findMany({
        include: {
          applicant: {
            include: {
              diseasesApplicants: {
                include: {
                  Disease: true // Include Disease details for each DiseasesApplicants relation
                }
              }
            }
          },
          square: true,
          dismissal: {
            orderBy: {
              id: 'desc'
            },
            take: 1
          }
        }
      })
  
      for (const accredited of accreditations) {
        if (accredited.state === 'موقف') {
          continue
        }
  
        const prescriptions = await this.prisma.prescription.findFirst({
          where: { accreditedGlobalId: accredited.globalId }
        })
  
        const dismissal = await this.prisma.dismissal.findFirst({
          where: { accreditedGlobalId: accredited.globalId },
          orderBy: {
            id: 'desc'
          }
        })
  
        const dismissalDate = dismissal?.dateToDay
        const renewalDate = prescriptions?.renewalDate
        const renewalDateObj = new Date(renewalDate)
        const dismissalDateObj = new Date(dismissalDate)
  
        const threeMonthsFromRenewalDate = new Date(renewalDateObj)
        threeMonthsFromRenewalDate.setMonth(threeMonthsFromRenewalDate.getMonth() + 3)
  
        const threeMonthsFromDismissalDate = new Date(dismissalDateObj)
        threeMonthsFromDismissalDate.setMonth(threeMonthsFromDismissalDate.getMonth() + 3)
  
        let newState
  
        if (renewalDate < currentDate && threeMonthsFromRenewalDate < currentDate) {
          newState = 'موقف'
        } else if (threeMonthsFromDismissalDate < currentDate) {
          newState = 'موقف'
        } else if (renewalDate < currentDate) {
          newState = 'منتهي'
        } else if (renewalDate >= currentDate) {
          newState = 'مستمر'
        }
  
        await this.prisma.accredited.update({
          where: { globalId: accredited.globalId },
          data: {
            state: newState,
            version: { increment: 1 } // Increment version for conflict resolution
          }
        })
      }
  
      const page = dataFilter?.page
      const pageSize = dataFilter?.pageSize
      delete dataFilter?.page
      delete dataFilter?.pageSize
      let include = dataFilter?.include
      let orderBy = dataFilter?.orderBy
      delete dataFilter?.include
      delete dataFilter?.orderBy
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      if (dataFilter) {
        dataFilter = convertEqualsToInt(dataFilter)
      } else {
        dataFilter = {}
      }
  
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const accredited = await this.prisma.accredited.findMany({
          where: { ...dataFilter, deleted: false },
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await this.prisma.accredited.count({
          where: { ...dataFilter, deleted: false }
        })
        return {
          info: accredited,
          total,
          page,
          pageSize
        }
      }
      return await this.prisma.accredited.findMany({
        where: { ...dataFilter, deleted: false },
        include,
        orderBy
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving accreditations.', error)
    }
  }
  

  async filterAccreditedByDateAndLocation(squareId, location, docter, state) {
    try {
      // Initialize an empty where clause for Accredited
      let whereClause = {}

      // Add squareId filtering if provided
      if (squareId) {
        whereClause.squareId = squareId
      }
      if (docter) {
        whereClause.doctor = docter
      }
      if (state) {
        whereClause.state = state
      }


      if (location) {
        whereClause.treatmentSite = location
      }

      const accredited = await this.prisma.accredited.findMany({
        where: whereClause
      })

      return accredited
    } catch (error) {
      throw new DatabaseError('Error retrieving filtered accredited records.', error)
    }
  }

  async getAllAccreditations(dataFillter) {
    try {
      const page     = dataFillter?.page
      const pageSize = dataFillter?.pageSize
      delete dataFillter?.page
      delete dataFillter?.pageSize
  
      let include = dataFillter?.include
      let orderBy = dataFillter?.orderBy
      delete dataFillter?.include
      delete dataFillter?.orderBy
  
      include = include ? convertTopLevelStringBooleans(include) : {}
  
      dataFillter = dataFillter ? convertEqualsToInt(dataFillter) : {}
  
      orderBy = {
        formNumber: 'asc',
        ...(orderBy ?? {})
      }
  
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
  
        const accredited = await this.prisma.accredited.findMany({
          where:   dataFillter,
          include,
          skip,
          take,
          orderBy
        })
  
        const total = await this.prisma.accredited.count({ where: dataFillter })
  
        return { info: accredited, total, page, pageSize }
      }
  
      return await this.prisma.accredited.findMany({
        where: dataFillter,
        include,
        orderBy
      })
    } catch (error) {
      throw new DatabaseError('Error searching accreditations.', error)
    }
  }
  

  async getAccreditationById(id) {
    try {
      const accreditation = await this.prisma.accredited.findUnique({
        where: { globalId: id },
        include: {
          applicant: {
            select: {
              name: true
            }
          },
          prescription: {
            orderBy: { prescriptionDate: 'desc' },
            take: 1
          },
          attachment: true
        }
      })

      if (!accreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`)
      }

      return accreditation
    } catch (error) {
      throw new DatabaseError('Error retrieving accreditation.', error)
    }
  }

  async countAllAccredited() {
    try {
      // Count all Accredited records where "deleted" is false
      const accreditedCount = await this.prisma.accredited.count({
        where: {
          deleted: false // Count only non-deleted records
        }
      })
      return accreditedCount
    } catch (error) {
      console.error('Error counting accredited records:', error)
      throw new Error('Failed to count accredited records')
    }
  }

  // async createAccreditation(AccreditedData, fileAtch, filePt) {
  //   try {
  //     const timestamp = Date.now()
  //     const uniqueId = uuidv4()
  //     const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}` //remove name artib
  //     const {
  //       numberOfRfid,
  //       type,
  //       formNumber,
  //       prescriptionDate,
  //       applicantId,
  //       pharmacyId,
  //       squareId,
  //       ...rest
  //     } = AccreditedData

  //     const accreited = await this.prisma.accredited.create({
  //       data: {
  //         numberOfRfid: +numberOfRfid,
  //         formNumber: +formNumber,
  //         ...rest,
  //         globalId: globalId
  //       }
  //     })

  //     const atch = await this.prisma.attachment.create({
  //       data: {
  //         type: type, // Use shorthand property names
  //         accreditedGlobalId: accreited.globalId, // Use shorthand property names
  //         attachmentFile: fileAtch,
  //         globalId: `${process.env.LOCAL_DB_ID}-${uuidv4()}-${new Date()}` // Assign the generated global ID
  //       }
  //     })

  //     const renewalDate = new Date()
  //     renewalDate.setMonth(renewalDate.getMonth() + 6)

  //     const pt = await this.prisma.prescription.create({
  //       data: {
  //         prescriptionDate: prescriptionDate,
  //         renewalDate,
  //         attachedUrl: filePt,
  //         accreditedGlobalId: accreited.globalId,
  //         globalId: `${process.env.LOCAL_DB_ID}-${uuidv4()}-${new Date()}` // Assign the generated global ID
  //       }
  //     })
  //     const app = await this.prisma.applicant.update({
  //       where: { globalId: AccreditedData.applicantGlobalId },
  //       data: {
  //         accredited: true
  //       }
  //     })

  //     return accreited
  //   } catch (error) {
  //     throw new DatabaseError('Error updating accreditation.', error)
  //   }
  // }
  async createAccreditation(AccreditedData, fileAtch, filePt) {
    const transaction = await this.prisma.$transaction(async (prisma) => {
      try {
        const timestamp = Date.now()
        const uniqueId = uuidv4()
        const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}` // remove name artib
        const {
          numberOfRfid,
          type,
          formNumber,
          prescriptionDate,
          applicantId,
          pharmacyId,
          squareId,
          ...rest
        } = AccreditedData

        // Create accreditation record
        const accreited = await prisma.accredited.create({
          data: {
            numberOfRfid: +numberOfRfid,
            formNumber: +formNumber,
            ...rest,
            globalId: globalId
          }
        })

        // Create attachment record
        const atch = await prisma.attachment.create({
          data: {
            type: type, // Use shorthand property names
            accreditedGlobalId: accreited.globalId, // Use shorthand property names
            attachmentFile: fileAtch,
            globalId: `${process.env.LOCAL_DB_ID}-${uuidv4()}-${new Date()}` // Assign the generated global ID
          }
        })

        // Set renewal date
        const renewalDate = new Date()
        renewalDate.setMonth(renewalDate.getMonth() + 6)

        // Create prescription record
        const pt = await prisma.prescription.create({
          data: {
            prescriptionDate: prescriptionDate,
            renewalDate,
            attachedUrl: filePt,
            accreditedGlobalId: accreited.globalId,
            globalId: `${process.env.LOCAL_DB_ID}-${uuidv4()}-${new Date()}` // Assign the generated global ID
          }
        })

        // Update applicant accreditation status
        const app = await prisma.applicant.update({
          where: { globalId: AccreditedData.applicantGlobalId },
          data: {
            accredited: true
          }
        })

        // Return the accreditation record (or any other data if needed)
        return accreited
      } catch (error) {
        // In case of an error, Prisma will automatically rollback the transaction
        throw new DatabaseError('Error updating accreditation.', error)
      }
    })

    return transaction
  }
  async updateAccreditation(id, AccreditedData, fileAtch, filePt) {
    try {
    const timestamp = Date.now()
    const uniqueId = uuidv4()
    const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}` //remove name artib
    const {
      type,
      numberOfRfid,
      formNumber,

      prescriptionDate,
      ...rest
    } = AccreditedData

    const accreditexsting = await this.prisma.accredited.findFirst({
      where: { globalId: id }
    })

    const accreited = await this.prisma.accredited.update({
      where: { globalId: id },
      data: {
        numberOfRfid: numberOfRfid ? +numberOfRfid : accreditexsting.numberOfRfid,
        formNumber: formNumber ? +formNumber : accreditexsting.formNumber,

        ...rest
      }
    })
    if (fileAtch) {
      const atchment = await this.prisma.attachment.findFirst({
        where: { accreditedGlobalId: accreited.globalId }
      })
      if (atchment) {
        const atch = await this.prisma.attachment.update({
          where: { globalId: atchment.globalId },
          data: {
            type: type, // Use shorthand property names
            accreditedGlobalId: accreited.globalId, // Use shorthand property names
            attachmentFile: fileAtch,
            version: { increment: 1 }, // Correctly increment the version for conflict resolution

          }
        })
      }
    }

    const renewalDate = new Date(prescriptionDate)
    renewalDate.setMonth(renewalDate.getMonth() + 6)
    if (filePt) {
      const prescription = await this.prisma.prescription.findFirst({
        where: { accreditedGlobalId: accreited.globalId }
      })
      if (prescription) {
        const pt = await this.prisma.prescription.update({
          where: { globalId: prescription.globalId },
          data: {
            prescriptionDate: prescriptionDate,
            renewalDate,
            attachedUrl: filePt,
            accreditedGlobalId: accreited.globalId,
            version: { increment: 1 }, // Correctly increment the version for conflict resolution
          }
        })
      }
    }


    return accreited
    } catch (error) {
      throw new DatabaseError('Error updating accreditation.', error)
    }
  }


  async updateAccreditationState(id, state) {
    try {
      const existingAccreditation = await this.prisma.accredited.findUnique({
        where: { globalId: id }
      })

      if (!existingAccreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`)
      }

      return await this.prisma.accredited.update({
        where: { id },
        data: {
          state
        }
      })
    } catch (error) {
      throw new DatabaseError('Error updating accreditation.', error)
    }
  }

  async deleteAccreditation(id) {
    try {
      // Attempt to find the accreditation by ID
      const accreditation = await this.prisma.accredited.findUnique({
        where: { globalId: id }
      })

      // If no accreditation is found, throw a custom NotFoundError
      if (!accreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`)
      }
      const name = accreditation.applicant?.name

      // Update the accreditation to mark it as deleted and increment its version
      await this.prisma.accredited.update({
        where: { globalId: id },
        data: {
          deleted: true, // Assuming the field to mark as deleted is named 'deleted' not 'delete'
          version: { increment: 1 } // Correctly increment the version for conflict resolution
        }
      })

      return name // Return the updated accreditation object
    } catch (error) {
      // Wrap and rethrow any errors as a DatabaseError
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async AccreditedByPrescriptionServer(dataFilter) {
    // try {
    const page = dataFilter?.page
    const pageSize = dataFilter?.pageSize
    delete dataFilter?.page
    delete dataFilter?.pageSize
    if (page && pageSize) {
      const skip = (page - 1) * pageSize
      const take = pageSize
      const orderBy = {
        formNumber: 'asc',            
        ...(dataFilter?.orderBy ?? {})
      }
      const Accredited = await this.prisma.accredited.findMany({
        where:
        { ...(dataFilter ?? {}) },
        include: {
          prescription: true,
          applicant: {
            include: {
              directorate: true,
              diseasesApplicants: {
                include: {
                  Disease: true
                }
              }
            }
          }
        },
        skip: +skip,
        take: +take
      })
      const total = await this.prisma.accredited.count({
        where: dataFilter
      })

      const reports = Accredited.map((accredited) => {
        const applicant = {
          name: accredited.applicant.name,
          phoneNumber: accredited.applicant.phoneNumber,
          state: accredited.state,
          formNumber: accredited.formNumber

        }

        const Namedirectorate = accredited.applicant.directorate.name
        const formNumber= accredited.formNumber

        const diseaseNames = accredited.applicant.diseasesApplicants
          .map((da) => da.Disease.name)
          .join(', ')

        const prescription = {
          latestPrescriptionDate: accredited.prescription
            .map((da) => new Date(da.prescriptionDate))
            .sort((a, b) => a - b)
            .pop()
            .toISOString()
            .split('T')[0],

          renewalDate: accredited.prescription
            .map((da) => new Date(da.renewalDate))
            .sort((a, b) => a - b)
            .pop()
            .toISOString()
            .split('T')[0]
        }

        const days = calculateDaysBetweenDates(
          prescription.latestPrescriptionDate,
          prescription.renewalDate
        )
        const months = calculateMonthsBetweenDates(
          prescription.latestPrescriptionDate,
          prescription.renewalDate
        )

        return new AccreditedByPrescription(
          applicant,
          formNumber,
          diseaseNames,
          Namedirectorate,
          prescription,
          days,
          months
        )
      })

      return { info: reports, total: total, page: page, pageSize: pageSize }
    } else {
      const Accredited = await this.prisma.accredited.findMany({
        where:

          dataFilter,

        include: {
          prescription: true,
          applicant: {
            include: {
              directorate: true,
              diseasesApplicants: {
                include: {
                  Disease: true
                }
              }
            }
          }
        }
      })
      const reports = Accredited.map((accredited) => {
        const applicant = {
          name: accredited.applicant.name,
          phoneNumber: accredited.applicant.phoneNumber,
          state: accredited.state,
          formNumber: accredited.formNumber
        }

        const Namedirectorate = accredited.applicant.directorate.name

        const diseaseNames = accredited.applicant.diseasesApplicants
          .map((da) => da.Disease.name)
          .join(', ')

        const prescription = {
          latestPrescriptionDate: accredited.prescription
            .map((da) => new Date(da.prescriptionDate))
            .sort((a, b) => a - b)
            .pop()
            .toISOString()
            .split('T')[0],

          renewalDate: accredited.prescription
            .map((da) => new Date(da.renewalDate))
            .sort((a, b) => a - b)
            .pop()
        }

        const days = calculateDaysBetweenDates(
          prescription.latestPrescriptionDate,
          prescription.renewalDate
        )
        const months = calculateMonthsBetweenDates(
          prescription.latestPrescriptionDate,
          prescription.renewalDate
        )
        const formNumber= accredited.formNumber

        return new AccreditedByPrescription(
          applicant,
          formNumber,
          diseaseNames,
          Namedirectorate,
          prescription,
          days,
          months
        )
      })
      return reports
    }

    // Helper function to calculate days between two dates
    function calculateDaysBetweenDates(date1, date2) {
      const startDate = new Date(date1)
      const endDate = new Date(date2)
      const differenceInMilliseconds = endDate - startDate
      const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24)
      return Math.round(differenceInDays)
    }

    // Helper function to calculate months between two dates
    function calculateMonthsBetweenDates(date1, date2) {
      const startDate = new Date(date1)
      const endDate = new Date(date2)
      if (startDate > endDate) {
        return 0
      }
      const yearsDifference = endDate.getFullYear() - startDate.getFullYear()
      const monthsDifference = endDate.getMonth() - startDate.getMonth()
      return yearsDifference * 12 + monthsDifference
    }
    // } catch (error) {
    //   throw new DatabaseError('Error fetching accreditation data.', error)
    // }
  }
  async getPrintAccreditationById(id) {
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
                  where: { deleted: false }
                }
              }
            },
            square: true,
            pharmacy: { include: { Governorate: true } },
            prescription: { orderBy: { prescriptionDate: 'desc' }, take: 1 }
          }
        })
      ]);
  
      if (!accreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`);
      }
  
      const processedDiseases = allDiseases.map(disease => ({
        globalId: disease.globalId,
        name: disease.name,
        cheacked: accreditation.applicant.diseasesApplicants
          .some(da => da.Disease.globalId === disease.globalId)
      }));
  
      const processedSquares = allSquares.map(square => ({
        globalId: square.globalId,
        name: square.name,
        cheacked: accreditation.square?.globalId === square.globalId
      }));
  
      return {
        ...accreditation,
        applicant: {
          ...accreditation.applicant,
          directorateName: accreditation.applicant.directorate.name,
          governorateName: accreditation.applicant.directorate.Governorate.name,
          categoryName: accreditation.applicant.category.name,
          diseasesApplicants: processedDiseases
        },
        square: processedSquares
      };
  
    } catch (error) {
      throw new DatabaseError('Error retrieving accreditation.', error);
    }
  }
}

module.exports = AccreditedService
