const DatabaseError = require('../errors/DatabaseError')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')
const ApplicantByDirectorateViewModel = require('../viewModels/ApplicantByDirectorateViewModel')
const ApplicantByCategoryViewModel = require('../viewModels/ApplicantByCategoryViewModel ')
const convertStringNumbers = require('../../server/utilty/convertToInt')

const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

const { v4: uuidv4 } = require('uuid')
class ApplicantService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async getAllApplicants(dataFillter) {
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
        const applicant = await this.prisma.applicant.findMany({
          where: {
            ...dataFillter,

            deleted: false,
            accredited: false
          },
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await this.prisma.applicant.count({
          where: { ...dataFillter, deleted: false, accredited: false }
        })
        return {
          info: applicant,
          total,
          page,
          pageSize
        }
      }
      return await this.prisma.applicant.findMany({
        where: {
          ...dataFillter,
          deleted: false,
          accredited: false
        },
        include,
        orderBy
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving applicants.', error)
    }
  }
  async getAllApplicantsUseUpdate(dataFillter) {
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
        const applicant = await this.prisma.applicant.findMany({
          where: {
            ...dataFillter,

            deleted: false,
          },
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await this.prisma.applicant.count({
          where: { ...dataFillter, deleted: false }
        })
        return {
          info: applicant,
          total,
          page,
          pageSize
        }
      }
      return await this.prisma.applicant.findMany({
        where: {
          ...dataFillter,
          deleted: false,
        },
        include,
        orderBy
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving applicants.', error)
    }
  }
  async countAllApplicants() {
    try {
      const count = await this.prisma.applicant.count({
        where: { accredited: false, deleted: false } // You can adjust this `where` clause as per your needs
      })
      return count
    } catch (error) {
      throw new DatabaseError('Error counting applicants.', error)
    }
  }

  async getApplicantMonthlyGenderCounts() {
    try {
      // جلب جميع سجلات الصرف
      const dismissals = await this.prisma.dismissal.findMany({
        where: { deleted: false },
        include: {
          Accredited: {
            include: {
              applicant: {
                select: {
                  gender: true,
                  submissionDate: true
                }
              },
              square: {
                select: {
                  name: true
                }
              }
            }
          }
        }
      })
  
      let malesCounts = new Array(12).fill(0)
      let femalesCounts = new Array(12).fill(0)
      let squareMap = {}
  
      // تجميع البيانات
      dismissals.forEach((dismissal) => {
        const accredited = dismissal.Accredited
        const applicant = accredited?.applicant
        const squareName = accredited?.square?.name
  
        if (applicant?.submissionDate) {
          const month = applicant.submissionDate.getMonth() // 0-based
  
          if (applicant.gender === 'M') {
            malesCounts[month]++
          } else if (applicant.gender === 'F') {
            femalesCounts[month]++
          }
  
          if (squareName) {
            squareMap[squareName] = (squareMap[squareName] || 0) + 1
          }
        }
      })
  
      const monthlyCounts = malesCounts.map((maleCount, index) => ({
        month: index + 1, // 1-based
        males: maleCount,
        females: femalesCounts[index]
      }))
  
      const result = Object.entries(squareMap).map(([name, count]) => ({
        name,
        count
      }))
  
      const accreditCount = dismissals.length // العدد الفعلي للمستفيدين الذين تم الصرف لهم
  
      return { monthlyCounts, result, accreditCount }
    } catch (error) {
      throw new DatabaseError('Failed to fetch actual applicant monthly gender counts', error)
    }
  }
  

  async getApplicantById(id) {
    try {

      const existingApplicant = await this.prisma.Applicant.findUnique({
        where: { globalId: id }
      })

      if (!existingApplicant) {
        throw new NotFoundError(`Applicant with id ${id} not found.`)
      }
      const applicant = await this.prisma.applicant.findUnique({
        where: { globalId: id },
        include: { category: true ,
                  directorate:true,
                  diseasesApplicants:true,
        },
      })

      if (!applicant) {
        throw new NotFoundError(`Applicant with id ${id} not found.`)
      }

      return applicant
    } catch (error) {
      throw new DatabaseError('Error retrieving applicant.', error)
    }
  }

  async createApplicant(ApplicantData) {
    try {
      const timestamp = Date.now()
      const uniqueId = uuidv4()
      // Construct the globalId by combining the local database ID, a UUID, and the current timestamp
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`
      const { diseaseGlobalId, ...rest } = ApplicantData
      const applicant = await this.prisma.applicant.create({
        data: {
          ...rest,
          globalId: globalId // Assigning the generated globalId to the applicant's record
        }
      })
      if (applicant) {
        const timestamp = Date.now()
        const uniqueId = uuidv4()
        const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`

        const connectDiseaseWithApplicant = await this.prisma.diseasesApplicants.create({
          data: {
            diseaseGlobalId: diseaseGlobalId,
            deleted: false,
            applicantGlobalId: applicant.globalId,
            globalId: globalId
          }
        })
        if (applicant && connectDiseaseWithApplicant) return applicant
      } else throw new DatabaseError('Error creating new applicant. at applicantService.js L:181')
    } catch (error) {
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async updateApplicant(id, ApplicantData) {
    try {
      const { diseaseGlobalId } = ApplicantData
      delete ApplicantData.diseaseGlobalId
      const existingApplicant = await this.prisma.Applicant.findUnique({
        where: { globalId: id }
      })

      if (!existingApplicant) {
        throw new NotFoundError(`Applicant with id ${id} not found.`)
      }

      const res = await this.prisma.Applicant.update({
        where: { globalId: id },
        data: {
          ...ApplicantData,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })

      const diseasesApplicantsExist = await this.prisma.diseasesApplicants.findFirst({
        where: { applicantGlobalId: existingApplicant.globalId, diseaseGlobalId: diseaseGlobalId }
      })
      if (!diseasesApplicantsExist) {
        throw new NotFoundError(`Applicant with id ${id} not found.`)
      }
      await this.prisma.diseasesApplicants.update({
        where: { globalId: diseasesApplicantsExist.globalId },
        data: {
          diseaseGlobalId: diseaseGlobalId,
          applicantGlobalId: existingApplicant.globalId,

          version: { increment: 1 } // Increment version for conflict resolution
        }
      })

      return res
    } catch (error) {
      throw new DatabaseError('Error updating applicant.', error)
    }
  }
  async updateApplicantAccredited(id) {
    try {
      const existingApplicant = await this.prisma.applicant.findUnique({
        where: { globalId: id }
      })

      if (!existingApplicant) {
        throw new NotFoundError(`Applicant with id ${id} not found.`)
      }

      // Update accredited status
      await this.prisma.applicant.update({
        where: { globalId: existingApplicant.globalId },
        data: {
          accredited: true,
          version: { increment: 1 }
        }
      })

      // Delete the applicant
      return await this.prisma.applicant.delete({
        where: { globalId: existingApplicant.globalId }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error updating and deleting applicant.', error)
    }
  }

  async deleteApplicant(id) {
    try {
      const applicant = await this.prisma.Applicant.findUnique({
        where: { globalId: id }
      })

      if (!applicant) {
        throw new NotFoundError(`Applicant with id ${id} not found.`)
      }

      const applicantName = await this.prisma.Applicant.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })

      return applicantName
    } catch (error) {
      throw new DatabaseError('Error deleting applicant.', error)
    }
  }

  //no need
  async getApplicantReportByDirectorate(directorateId) {
    try {
      const Accredited = await this.prisma.Accredited.findMany({
        where: {
          Applicant: {
            Directorate: {
              id: directorateId // Assuming 'id' is the field name for Directorate ID
            }
          }
        },
        include: {
          Dismissal: true,
          Applicant: {
            include: {
              Directorate: true,
              Category: true,
              DiseasesApplicants: {
                include: {
                  Disease: true
                }
              }
            }
          }

          // Make sure this relationship is correctly defined in your Prisma schema
        }
      })
      const reports = Accredited.map((Accredited) => {
        const applicant = {
          name: Accredited.Applicant.name,
          gender: Accredited.Applicant.gender,
          phoneNumber: Accredited.Applicant.phoneNumber,
          numberOfRfid: Accredited.numberOfRfid
        }
        const state = Accredited.state
        const Namedirectorate = Accredited.Applicant.Directorate.name
        const Namecategory = Accredited.Applicant.Category.SupportRatio + '%'
        const diseaseNames = Accredited.Applicant.DiseasesApplicants.map(
          (da) => da.Disease.name
        ).join(', ')

        const dismissals = {
          totalAmount: Accredited.Dismissal.map((da) => da.totalAmount).reduce(
            (acc, current) => acc + current,
            0
          ),

          approvedAmount: Accredited.Dismissal.map((da) => da.approvedAmount).reduce(
            (acc, current) => acc + current,
            0
          )
        }
        return new ApplicantByDirectorateViewModel(
          applicant,
          diseaseNames,
          Namedirectorate,
          state,
          dismissals,
          Namecategory
        )
      })
      return reports
    } catch (error) {
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }
  //******************************************************************************** */

  //no need
  async getAllAccreditedWithParams(filterParams) {
    try {
      const convertString = convertStringNumbers(filterParams)
      filterParams = convertString
      const { applicantName: name, ...rest } = filterParams
      if (
        !rest.squareId ||
        isNaN(rest.squareId) ||
        rest.squareId == '' ||
        rest.squareId.equals == ''
      ) {
        delete rest.squareId
      }

      const Accredited = await this.prisma.Accredited.findMany({
        where: {
          ...rest,

          Applicant: name // Using 'name' instead of 'applicantName'
            ? {
                name: name
              }
            : undefined // Pass undefined if 'name' is not provided to ignore this filter
        },
        include: {
          Dismissal: true,
          Applicant: {
            include: {
              Directorate: true,
              Category: true,
              DiseasesApplicants: {
                include: {
                  Disease: true
                }
              }
            }
          }

          // Make sure this relationship is correctly defined in your Prisma schema
        }
      })

      return Accredited
    } catch (error) {
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }

  async getAllAccreditedAfterDismissal(filterParams) {
    const page = filterParams?.page
    const pageSize = filterParams?.pageSize
    delete filterParams?.page
    delete filterParams?.pageSize
    if (page && pageSize) {
      const skip = (+page - 1) * +pageSize
      const take = +pageSize
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
          skip: +skip,
          take: +take

          // Make sure this relationship is correctly defined in your Prisma schema
        })
        const total = await this.prisma.dismissal.count({
          where: filterParams
        })
        const reports = dismissal?.map((dismissal) => {
          const applicant = {
            name: dismissal.Accredited.applicant.name,
            gender: dismissal.Accredited.applicant.gender,
            phoneNumber: dismissal.Accredited.applicant.phoneNumber,
            numberOfRfid: dismissal.Accredited.applicant.phoneNumber
          }
          const Month = dismissal.month
          const year = dismissal.year
          console.log('🚀 ~ ApplicantService ~ reports ~ Month:', Month)
          const state = dismissal.Accredited.state
          const Namedirectorate = dismissal.Accredited.applicant.directorate.name
          const Namecategory = dismissal.Accredited.applicant.category.SupportRatio + '%'
          const diseaseNames = dismissal.Accredited.applicant.diseasesApplicants
            .map((da) => da.Disease.name)
            .join(', ')

          const dismissals = {
            totalAmount: dismissal.totalAmount,

            approvedAmount: dismissal.amountPaid
          }
          return new ApplicantByDirectorateViewModel(
            applicant,
            diseaseNames,
            Namedirectorate,
            state,
            dismissals,
            Namecategory,
            Month,
            year
          )
        })

        return {
          info: reports,
          total: total,
          page: page,
          pageSize: pageSize
        }
      } catch (error) {
        throw new DatabaseError('Error deleting accreditation.', error)
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

        // Make sure this relationship is correctly defined in your Prisma schema
      })
      const reports = dismissal?.map((dismissal) => {
        const applicant = {
          name: dismissal.Accredited.applicant.name,
          gender: dismissal.Accredited.applicant.gender,
          phoneNumber: dismissal.Accredited.applicant.phoneNumber,
          numberOfRfid: dismissal.Accredited.applicant.phoneNumber
        }
        const Month = dismissal.month
        const year = dismissal.year
        const state = dismissal.Accredited.state
        const Namedirectorate = dismissal.Accredited.applicant.directorate.name
        const Namecategory = dismissal.Accredited.applicant.category.SupportRatio + '%'
        const diseaseNames = dismissal.Accredited.applicant.diseasesApplicants
          .map((da) => da.Disease.name)
          .join(', ')

        const dismissals = {
          totalAmount: dismissal.totalAmount,

          approvedAmount: dismissal.amountPaid
        }
        return new ApplicantByDirectorateViewModel(
          applicant,
          diseaseNames,
          Namedirectorate,
          state,
          dismissals,
          Namecategory,
          Month,
          year
        )
      })
      return reports
    }
  }

  //**********************************************  *********************************** */
  //no need
  async ApplicantByCategory(applicantfilter) {
    try {
      const page = applicantfilter?.page
      const pageSize = applicantfilter?.pageSize
      delete applicantfilter?.page
      delete applicantfilter?.pageSize

      if (page && pageSize) {
        const skip = (page - 1) * pageSize
        const take = pageSize

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

            // Make sure this relationship is correctly defined in your Prisma schema
          },
          skip: +skip,
          take: +take
        })
        const total = await this.prisma.applicant.count({
          where: {
            ...applicantfilter,
            accredited: false,
            deleted: false
          }
        })

        const reports = Applicant.map((Applican) => {
          const applicant = {
            name: Applican.name,
            submissionDate: Applican.submissionDate.toISOString().split('T')[0],
            phoneNumber: Applican.phoneNumber
          }
          const categoryName = Applican.category.name
          const Namedirectorate = Applican.directorate.name
          const diseaseNames = Applican.diseasesApplicants.map((da) => da.Disease.name).join(', ')
          return new ApplicantByCategoryViewModel(
            applicant,
            diseaseNames,
            Namedirectorate,
            categoryName
          )
        })

        return {
          info: reports,
          total: total,
          page: page,
          pageSize: pageSize
        }
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

            // Make sure this relationship is correctly defined in your Prisma schema
          }
        })
        const reports = Applicant.map((Applican) => {
          const applicant = {
            name: Applican.name,
            submissionDate: Applican.submissionDate.toISOString().split('T')[0],
            phoneNumber: Applican.phoneNumber
          }
          const categoryName = Applican.category.name
          const Namedirectorate = Applican.directorate.name
          const diseaseNames = Applican.diseasesApplicants.map((da) => da.Disease.name).join(', ')
          return new ApplicantByCategoryViewModel(
            applicant,
            diseaseNames,
            Namedirectorate,
            categoryName
          )
        })

        return reports
      }
    } catch (error) {
      console.error('Error fetching applicant report:', error)
      throw new DatabaseError('Error deleting accreditation.', error)
    }
  }
}

module.exports = ApplicantService
