const DatabaseError = require('../errors/DatabaseError')
const NotFoundError = require('../errors/NotFoundError')
const convertEqualsToInt = require('../utilty/convertToInt')
const convertTopLevelStringBooleans = require('../utilty/convertTopLevelStringBooleans')

const { v4: uuidv4 } = require('uuid')
function getYearAndMonth(dateString) {
  // Parse the date string
  const date = new Date(dateString)

  // Extract the year and month
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth() + 1 // getUTCMonth() returns 0-11, so we add 1

  return { year, month }
}

class DismissalService {
  constructor(prisma) {
    this.prisma = prisma
  }
  async getAllDismissals(dataFillter) {
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

      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const dismissal = await this.prisma.dismissal.findMany({
          where: {
            ...dataFillter,
            deleted: false
          },
          include,
          skip: +skip,
          take: +take,
          orderBy
        })
        const total = await this.prisma.dismissal.count({
          where: dataFillter
        })
        return {
          info: dismissal,
          total,
          page,
          pageSize
        }
      }
      return await this.prisma.dismissal.findMany({
        where: dataFillter,
        include,
        orderBy
      })
    } catch (error) {
      throw new DatabaseError('Error retrieving dismissals.', error)
    }
  }

  async getDismissalById(id) {
    try {
      const dismissal = await this.prisma.dismissal.findUnique({
        where: { globalId: id }
      })
      if (!dismissal) {
        throw new NotFoundError(`Dismissal with id ${id} not found.`)
      }
      return dismissal
    } catch (error) {
      throw new DatabaseError('Error retrieving dismissal.', error)
    }
  }

  async createDismissal(DismissalData) {
    const { pharmacyGlobalId, ...data } = DismissalData
    const timestamp = Date.now()
    const uniqueId = uuidv4()
    const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1
    const currentYear = currentDate.getFullYear()

    const currentMonthStr = String(currentMonth)
    const currentYearStr = currentYear.toString()

    function isDateBetween(targetDate, startDate, endDate) {

      return targetDate >= startDate && targetDate <= endDate
    }
    try {
      // Check if accredited is not stopped
      const accreditedExists = await this.prisma.accredited.findFirst({
        where: { globalId: data.accreditedGlobalId, state: 'موقف' }
      })
      if (accreditedExists) {
        return { message: 'هذا المريض موقف عليك مراجعة الادارة' }
      }

      // Check if dismissal already exists for this month
      const existingDismissal = await this.prisma.dismissal.findFirst({
        where: {
          accreditedGlobalId: data.accreditedGlobalId,
          month: currentMonthStr,
          year: currentYearStr
        }
      })
      if (existingDismissal) {
        return { message: 'تم الصرف مسبقا' }
      }

      // Check if dispensing is allowed for the current date in the pharmacy
      const pharmacy = await this.prisma.pharmacy.findUnique({
        where: { globalId: pharmacyGlobalId }
      })
      if (!pharmacy) {
        throw new NotFoundError(`Pharmacy with id ${pharmacyGlobalId} not found.`)
      }

      const { startDispenseDate: start, endispenseDate: end } = pharmacy
      const today = new Date()
      const dayOfMonth = today.getDate()
      const result = isDateBetween(dayOfMonth, start, end)
      if (!result) {
        return { message: 'انتهاء وقت الصرف في هذه الصيدلية' }
      }

      // Create new dismissal record
      return await this.prisma.dismissal.create({
        data: {
          ...data,
          month: currentMonthStr,
          year: currentYearStr,
          dateToDay: currentDate, // Corrected field name
          openDismissal: false,
          globalId
        }
      })
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError('Error creating new dismissal.', error)
      }
    }
  }

  async checkDismissal(DismissalData) {
    const { ...data } = DismissalData
    const timestamp = Date.now()
    const uniqueId = uuidv4() // Ensure uuidv4 is imported
    const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Normalize month
    const currentYear = currentDate.getFullYear() // Get full year

    const currentMonthStr = String(currentMonth)
    const currentYearStr = currentYear.toString()

    function isDateBetween(targetDate, startDate, endDate) {

      return targetDate >= startDate && targetDate <= endDate
    }

    try {
      // Check if accredited is not stopped
      const accreditedExists = await this.prisma.accredited.findFirst({
        where: { numberOfRfid: data.numberOfRfid, state: 'موقف' }
      })
      if (accreditedExists) {
        return { message: 'هذا المريض موقف عليك مراجعة الادارة' }
      }

      // Check if dismissal already exists for this month
      const accredited = await this.prisma.accredited.findFirst({
        where: { numberOfRfid: data.numberOfRfid }
      })
      if (!accredited) {
        throw new NotFoundError('Accredited does not exist.')
      }

      const existingDismissal = await this.prisma.dismissal.findFirst({
        where: {
          accreditedGlobalId: accredited.globalId,
          month: currentMonthStr,
          year: currentYearStr
        },
        orderBy: {
          id: 'desc'
        }
      })
      console.log("🚀 ~ DismissalService ~ checkDismissal ~ existingDismissal:", existingDismissal)
      if (existingDismissal) {
        return { message: 'تم الصرف مسبقا' }
      }

      // Check if dispensing is allowed for the current date in the pharmacy
      const pharmacy = await this.prisma.pharmacy.findFirst({
        where: { globalId: accredited.pharmacyGlobalId }
      })
      if (!pharmacy) {
        throw new NotFoundError(`Pharmacy with id ${accredited.pharmacyGlobalId} not found.`)
      }

      const { startDispenseDate: start, endispenseDate: end } = pharmacy

      const today = new Date()
      const dayOfMonth = today.getDate()
      const result = isDateBetween(dayOfMonth, start, end)
      console.log("🚀 ~ DismissalService ~ checkDismissal ~ result:", result)

      if (!result) {
        return { message: 'انتهاء وقت الصرف في هذه الصيدلية' }
      }else{
        return null
      }

    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError('Error checking dismissal.', error)
      }
    }
  }

  async updateDismissal(id, dismissalData) {
    try {
      const existingDismissal = await this.prisma.dismissal.findUnique({
        where: { globalId: id }
      })
      if (!existingDismissal) {
        throw new NotFoundError(`Dismissal with id ${id} not found.`)
      }
      const totalAmount = dismissalData.totalAmount
        ? +dismissalData.totalAmount
        : existingDismissal.totalAmount
      const amountPaid = dismissalData.amountPaid
        ? +dismissalData.amountPaid
        : existingDismissal.amountPaid
      const approvedAmount = dismissalData.approvedAmount
        ? +dismissalData.approvedAmount
        : existingDismissal.approvedAmount
      return await this.prisma.dismissal.update({
        where: { globalId: id },
        data: {
          ...dismissalData,
          totalAmount,
          amountPaid,
          approvedAmount,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })
    } catch (error) {
      throw new DatabaseError('Error updating dismissal.', error)
    }
  }
  async deleteDismissal(id) {
    
    try {
      const dismissal = await this.prisma.dismissal.findUnique({
        where: { globalId: id }
      })
            
      if (!dismissal) {
        throw new NotFoundError(`Dismissal with id ${id} not found.`)
      }

      return await this.prisma.dismissal.update({
        where: { globalId: id },
        data: {
          deleted: true,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })

    } catch (error) {
      throw new DatabaseError('Error deleting dismissal.', error)
    }
  }
}
module.exports = DismissalService
