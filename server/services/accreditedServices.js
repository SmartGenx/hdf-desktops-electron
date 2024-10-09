const { name } = require('ejs')
const DatabaseError = require('../errors/DatabaseError')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')
const AccreditedByPrescription = require('../viewModels/AccreditedByPrescription')
const { v4: uuidv4 } = require('uuid')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')
const { info } = require('console')

// Promisify fs methods to use async/await

class AccreditedService {
  constructor(prisma) {
    this.prisma = prisma
  }

  // Ensure local directory exists for a user

  async searchAccreditations(dataFillter) {
    function getDateMonthsFromNow(months) {
      let currentDate = new Date()
      let currentMonth = currentDate.getMonth()
      let currentYear = currentDate.getFullYear()

      let newMonth = currentMonth + months
      let newYear = currentYear

      if (newMonth > 11) {
        newYear += 1
        newMonth -= 12
      }

      let newDate = new Date(currentDate)
      newDate.setMonth(newMonth)
      newDate.setFullYear(newYear)

      return newDate
    }
    const threeMonthsFromNow = getDateMonthsFromNow(3)
    const sixMonthsFromNow = getDateMonthsFromNow(6)
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

      accreditations.map(async (accredited) => {
        const prescriptions = await this.prisma.prescription.findMany({
          where: { accreditedGlobalId: accredited.globalId },
          orderBy: [
            {
              prescriptionDate: 'desc' // Primary sort by date in descending order
            },
            {
              id: 'desc' // Secondary sort by id in descending order
            }
          ],
          take: 1 // Take only the first record after ordering
        })
        const dismissal = await this.prisma.dismissal.findFirst({
          where: { accreditedGlobalId: accredited.globalId }
        })

        const dateToDay = dismissal?.dateToDay
        const renewalDate = prescriptions[0].renewalDate
        let newState

        if (renewalDate > sixMonthsFromNow || dateToDay > threeMonthsFromNow) {
          newState = 'موقف'
        } else if (renewalDate > threeMonthsFromNow && !(dateToDay > threeMonthsFromNow)) {
          newState = 'مستمر'
        } else {
          newState = 'منتهي'
        }

        await this.prisma.accredited.update({
          where: { globalId: accredited.globalId },
          data: {
            state: newState,
            version: { increment: 1 } // Increment version for conflict resolution
          }
        })
      })

      const page = dataFillter?.page
      const pageSize = dataFillter?.pageSize
      delete dataFillter?.page
      delete dataFillter?.pageSize
      let include = dataFillter?.include
      let orderBy = dataFillter?.orderBy
      delete dataFillter?.include
      delete dataFillter?.orderBy
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      if (dataFillter) {
        dataFillter = convertEqualsToInt(dataFillter)
      } else {
        dataFillter = {}
      }

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const accredited = await this.prisma.accredited.findMany({
          where: { ...dataFillter, deleted: false },
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await this.prisma.accredited.count({
          where: { ...dataFillter, deleted: false }
        })
        return {
          info: accredited,
          total,
          page,
          pageSize
        }
      }
      return await this.prisma.accredited.findMany({
        where: { ...dataFillter, deleted: false },
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

      // Add location filtering if provided
      // You need to adjust this part based on how you want to filter by location.
      // For example, if location refers to 'currentResidence' in Applicant:
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
      const page = dataFillter?.page
      const pageSize = dataFillter?.pageSize
      delete dataFillter?.page
      delete dataFillter?.pageSize
      let include = dataFillter?.include
      let orderBy = dataFillter?.orderBy
      delete dataFillter?.include
      delete dataFillter?.orderBy
      if (include) {
        const convertTopLevel = convertTopLevelStringBooleans(include)
        include = convertTopLevel
      } else {
        include = {}
      }
      if (dataFillter) {
        dataFillter = convertEqualsToInt(dataFillter)
      } else {
        dataFillter = {}
      }
      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const accredited = await this.prisma.accredited.findMany({
          where: dataFillter,
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await this.prisma.accredited.count({
          where: dataFillter
        })
        return {
          info: accredited,
          total,
          page,
          pageSize
        }
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

  async createAccreditation(AccreditedData, fileAtch, filePt) {
    try {
      const timestamp = Date.now()
      const uniqueId = uuidv4()
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}` //remove name artib
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

      const accreited = await this.prisma.accredited.create({
        data: {
          numberOfRfid: +numberOfRfid,
          formNumber: +formNumber,
          ...rest,
          globalId: globalId
        }
      })

      const atch = await this.prisma.attachment.create({
        data: {
          type: type, // Use shorthand property names
          accreditedGlobalId: accreited.globalId, // Use shorthand property names
          attachmentFile: fileAtch,
          globalId: `${process.env.LOCAL_DB_ID}-${uuidv4()}-${new Date()}` // Assign the generated global ID
        }
      })

      const renewalDate = new Date()
      renewalDate.setMonth(renewalDate.getMonth() + 6)

      const pt = await this.prisma.prescription.create({
        data: {
          prescriptionDate: prescriptionDate,
          renewalDate,
          attachedUrl: filePt,
          accreditedGlobalId: accreited.globalId,
          globalId: `${process.env.LOCAL_DB_ID}-${uuidv4()}-${new Date()}` // Assign the generated global ID
        }
      })

      return accreited
    } catch (error) {
      throw new DatabaseError('Error updating accreditation.', error)
    }
  }

  async updateAccreditation(id, accreditedData, fileAtch, filePt) {
    try {
      const { type, prescriptionDate, ...rest } = accreditedData
      const existingAccreditation = await this.prisma.accredited.findUnique({
        where: { globalId: id }
      })

      if (!existingAccreditation) {
        throw new NotFoundError(`Accreditation with id ${id} not found.`)
      }
      const formNumber = accreditedData.formNumber
        ? +accreditedData.formNumber
        : existingAccreditation.formNumber
      const numberOfRfid = accreditedData.numberOfRfid
        ? +accreditedData.numberOfRfid
        : existingAccreditation.numberOfRfid
      const accreited = await this.prisma.accredited.update({
        where: { globalId: id },
        data: {
          ...rest,
          formNumber,
          numberOfRfid,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })

      const attchment = await this.prisma.attachment.findFirst({
        where: { accreditedGlobalId: id }
      })
      if (!attchment) {
        throw new NotFoundError(`Attachment with id ${id} not found.`)
      }

      await this.prisma.attachment.update({
        where: { globalId: attchment.globalId },
        data: {
          type: type > 0 ? type : attchment.type, // Use shorthand property names
          accreditedGlobalId: accreited.globalId, // Use shorthand property names
          attachmentFile: fileAtch > 0 ? fileAtch : attchment.attachmentFile,

          version: { increment: 1 } // Increment version for conflict resolution
        }
      })

      const pt = await this.prisma.prescription.findFirst({ where: { accreditedGlobalId: id } })
      if (!pt) {
        throw new NotFoundError(`Prescription with id ${id} not found.`)
      }
      const renewalDate = new Date()
      renewalDate.setMonth(renewalDate.getMonth() + 6)

      await this.prisma.prescription.update({
        where: { globalId: pt.globalId },
        data: {
          prescriptionDate: prescriptionDate > 0 ? prescriptionDate : pt.prescriptionDate,
          renewalDate: renewalDate,
          attachedUrl: filePt > 0 ? filePt : pt.attachedUrl,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })

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
    try {
      const page = dataFilter?.page
      const pageSize = dataFilter?.pageSize
      delete dataFilter?.page
      delete dataFilter?.pageSize
      if (page && pageSize) {
        const skip = (page - 1) * pageSize
        const take = pageSize

        const Accredited = await this.prisma.accredited.findMany({
          where: {
            applicant: {
              name: {
                contains: dataFilter?.name
              },
              directorate: {
                name: {
                  contains: dataFilter?.directorate
                }
              },
              diseasesApplicants: {
                some: {
                  Disease: {
                    name: {
                      contains: dataFilter?.disease
                    }
                  }
                }
              }
            },

            prescription: {
              some: {
                renewalDate: {
                  gt: dataFilter?.start && new Date(dataFilter?.start),
                  lt: dataFilter?.end && new Date(dataFilter?.end)
                }
              }
            }
          },

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
            state: accredited.state
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
          where: {
            applicant: {
              name: {
                contains: dataFilter?.name
              },
              directorate: {
                name: {
                  contains: dataFilter?.directorate
                }
              },
              diseasesApplicants: {
                some: {
                  Disease: {
                    name: {
                      contains: dataFilter?.disease
                    }
                  }
                }
              }
            },

            prescription: {
              some: {
                renewalDate: {
                  gt: dataFilter?.start && new Date(dataFilter?.start),
                  lt: dataFilter?.end && new Date(dataFilter?.end)
                }
              }
            }
          },

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
            state: accredited.state
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
    } catch (error) {
      throw new DatabaseError('Error fetching accreditation data.', error)
    }
  }
}

module.exports = AccreditedService
