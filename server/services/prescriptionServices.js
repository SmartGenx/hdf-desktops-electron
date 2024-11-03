const DatabaseError = require('../errors/DatabaseError')
const NotFoundError = require('../errors/NotFoundError')
const ValidationError = require('../errors/ValidationError')
const { v4: uuidv4 } = require('uuid')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

class PrescriptionService {
  constructor(prisma) {
    this.prisma = prisma
  }

  async getAllPrescriptions(dataFillter) {
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
        const prescription = await this.prisma.prescription.findMany({
          where: dataFillter,
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await this.prisma.prescription.count({
          where: dataFillter
        })
        return {
          info: prescription,
          total,
          page,
          pageSize
        }
      }
      return await this.prisma.prescription.findMany({
        where: dataFillter,
        include,
        orderBy
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving attachments.', error)
    }
  }

  async getPrescriptionById(id) {
    try {
      const attachment = await this.prisma.prescription.findFirst({
        where: { accreditedGlobalId: id }
      })

      if (!attachment) {
        throw new NotFoundError(`Attachment with id ${id} not found.`)
      }

      return attachment
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      }
      throw new DatabaseError('Error retrieving attachment.', error)
    }
  }

  async createPrescription(PrescriptionDatas, filePath) {
    try {
      const timestamp = Date.now()
      const uniqueId = uuidv4()
      // Concatenate the local DB ID, a UUID, and a timestamp to form a global ID
      const globalId = `${process.env.LOCAL_DB_ID}${uniqueId}-${timestamp}`
      const { prescriptionDate, accreditedGlobalId } = PrescriptionDatas
      const renewalDate = new Date(prescriptionDate)
      renewalDate.setMonth(renewalDate.getMonth() + 6)

      // Use Prisma to create a new Prescription record in the database
      return await this.prisma.prescription.create({
        data: {
          ...PrescriptionDatas,
          renewalDate,
          attachedUrl: filePath,
          accreditedGlobalId: accreditedGlobalId,
          globalId: globalId // Assign the generated global ID
        }
      })
    } catch (error) {
      // Catch and handle any errors, such as database constraints violations
      throw new DatabaseError('Error creating new prescription.', error)
    }
  }

  async updatePrescription(id, PrescriptionData) {
    try {
      const existingAttachment = await this.prisma.prescription.findUnique({
        where: { globalId: id }
      })

      if (!existingAttachment) {
        throw new NotFoundError(`Attachment with id ${id} not found.`)
      }

      return await this.prisma.prescription.update({
        where: { globalId: id },
        data: {
          ...PrescriptionData,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })
    } catch (error) {
      throw new DatabaseError('Error updating attachment.', error)
    }
  }

  async deletePrescription(id) {
    try {
      const attachment = await this.prisma.prescription.findUnique({
        where: { globalId: id }
      })

      if (!attachment) {
        throw new NotFoundError(`Attachment with id ${id} not found.`)
      }

      return await this.prisma.prescription.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })
    } catch (error) {
      throw new DatabaseError('Error deleting attachment.', error)
    }
  }
}

module.exports = PrescriptionService
