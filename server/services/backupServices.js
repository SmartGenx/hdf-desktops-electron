
const DatabaseError = require('../errors/DatabaseError')
const convertStringNumbers = require('../../server/utilty/convertToInt')

const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

const { v4: uuidv4 } = require('uuid')
class backupServices {
  constructor(prisma) {
    this.prisma = prisma
  }

  async getbackup(dataFillter) {
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
        const applicant = await this.prisma.backUp.findMany({
          where: { ...dataFillter },
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await this.prisma.backUp.count({
          where: { ...dataFillter }
        })
        return {
          info: applicant,
          total,
          page,
          pageSize
        }
      }
      return await this.prisma.backUp.findMany({
        where: {
          ...dataFillter
        },
        include,
        orderBy
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving applicants.', error)
    }
  }
  async createbackup(path, userName) {
    try {
      const timestamp = Date.now()
      const uniqueId = uuidv4()
      // Construct the globalId by combining the local database ID, a UUID, and the current timestamp
      const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`

      return await this.prisma.backUp.create({
        data: {
          path: path,
          userName: userName,
          globalId: globalId
        }
      })
    } catch (error) {
      throw new DatabaseError('Error creating applicant.', error)
    }
  }
}

module.exports = backupServices





