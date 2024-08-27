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
      console.log('🚀 ~ DismissalService ~ getAllDismissals ~ page:', page)
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
        console.log('🚀 ~ DismissalService ~ getAllDismissals ~ include:', include);

      } else {
        include = {}
      }


      if (page && pageSize) {
        const skip = (+page - 1) * +pageSize
        const take = +pageSize
        const dismissal = await this.prisma.dismissal.findMany({
          where: dataFillter,
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

  ////////////////////////////////////////////////////////////////////////////
  async createDismissal(DismissalData) {
    // const pharmacyGlobalId = DismissalData.pharmacyGlobalId;
    const { pharmacyGlobalId, ...data } = DismissalData
    const timestamp = Date.now()
    const uniqueId = uuidv4() // Ensure uuidv4 is imported
    const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`
    const currentDate = new Date()
    const currentMonth = currentDate.getMonth() + 1 // Normalize month
    const currentYear = currentDate.getFullYear() // Get full year

    const currentMonthStr = String(currentMonth)
    const currentYearStr = currentYear.toString()
    function isDateBetween(targetDate, startDate, endDate) {
      const target = new Date(targetDate)

      return target >= startDate && endDate <= endDate
    }

    try {
      const accredited = await this.prisma.dismissal.findFirst({
        where: { accreditedGlobalId: data.accreditedGlobalId }
      })
      if (!accredited) {
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
      }

      const checkdismissals = await this.prisma.dismissal.findFirst({
        where: { accreditedGlobalId: data.accreditedGlobalId, month: currentMonthStr }
      })

      if (!checkdismissals) {
        const checkdismissal = await this.prisma.dismissal.findFirst({
          where: { accreditedGlobalId: data.accreditedGlobalId }
        })
        await this.prisma.dismissal.update({
          where: {
            id: checkdismissal.id // Ensure the same record is updated
          },
          data: {
            openDismissal: true

            // Increment version for conflict resolution
          }
        })
      }
      const pharmacy = await this.prisma.pharmacy.findUnique({
        where: { globalId: pharmacyGlobalId }
      })

      // Check if pharmacy exists
      if (!pharmacy) {
        throw new NotFoundError(`Pharmacy with id ${pharmacyGlobalId} not found.`)
      }

      // Convert start and end dispense dates from pharmacy object
      const start = pharmacy.startDispenseDate
      const end = pharmacy.endispenseDate
      const today = new Date()
      const day = today.getDate()

      // Use the isDateBetween function to check if today's date is within the range
      const result = isDateBetween(day, start, end)
      const existingAccredited = await this.prisma.accredited.findUnique({
        where: { globalId: data.accreditedGlobalId }
      })

      if (!existingAccredited) {
        throw new NotFoundError('Accredited does not exist.')
      }

      if (result) {
        const dismissaed = await this.prisma.dismissal.findFirst({
          where: {
            openDismissal: true,
            accreditedGlobalId: data.accreditedGlobalId
          }
        })
        if (dismissaed) {
          return await this.prisma.dismissal.update({
            where: { globalId: dismissaed.globalId },
            data: {
              ...data,
              month: currentMonthStr,
              year: currentYearStr,
              dateToDay: currentDate, // Corrected field name
              openDismissal: false,
              globalId
            }
          })
        } else {
          return { message: 'تم الصرف مسبقا' }
        }
      } else {
        return { massage: 'ليس وقت الصر في هذي الصيدلية' }
      }
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error
      } else {
        throw new DatabaseError('Error creating new dismissal.', error)
        // Convert start and end dispense dates from pharmacy object
        //   const start = pharmacy.startDispenseDate;
        //   const end = pharmacy.endispenseDate;
        //   const today = new Date();
        //   const day = today.getDate();
        //   // Use the isDateBetween function to check if today's date is within the range
        //   const result = isDateBetween(day, start, end);

        //   if (result) {
        //     // const dismissal = await this.prisma.dismissal.findUnique({
        //     //   where: { AND: [{ month }, { year }, { globalId }] },
        //     // });
        //     const { year, month } = getYearAndMonth(new Date());
        //     return await this.prisma.dismissal.create({
        //       data: {
        //         ...dismissalData,
        //         dateToDay: new Date(),
        //         month: month.toString(),
        //         year: year.toString(),
        //         globalId,
        //       },
        //     });
        //   } else {
        //     // Handle the case where the date is not within the range
        //     return null; // Or throw an error or return a specific value indicating the issue
        //   }
        // }
        // catch (error) {
        //   throw new DatabaseError("Error retrieving dismissal.", error);
        // }
      }
    }
  }

  //////////////////////////////////////////////////////////////////////////

  // async startDismissal(dismissalData) {
  //   try {
  //     const pharmacyGlobalId = dismissalData.pharmacyGlobalId;
  //     delete dismissalData.pharmacyGlobalId;
  //     const timestamp = Date.now();
  //     const uniqueId = uuidv4(); // Ensure uuidv4 is imported correctly
  //     const globalId = `${process.env.LOCAL_DB_ID}-${uniqueId}-${timestamp}`;
  //     function isDateBetween(targetDate, startDate, endDate) {
  //       const target = new Date(targetDate);

  //       return target >= startDate && endDate <= endDate;
  //     }
  //     const pharmacy = await this.prisma.pharmacy.findUnique({
  //       where: { globalId: pharmacyGlobalId },
  //     });

  //     // Check if pharmacy exists
  //     if (!pharmacy) {
  //       throw new NotFoundError(`Pharmacy with id ${id} not found.`);
  //     }

  //     // Convert start and end dispense dates from pharmacy object
  //     const start = pharmacy.startDispenseDate;
  //     const end = pharmacy.endispenseDate;
  //     const today = new Date();
  //     const day = today.getDate();
  //     // Use the isDateBetween function to check if today's date is within the range
  //     const result = isDateBetween(day, start, end);

  //     if (result) {
  //       // const dismissal = await this.prisma.dismissal.findUnique({
  //       //   where: { AND: [{ month }, { year }, { globalId }] },
  //       // });
  //       const { year, month } = getYearAndMonth(new Date());
  //       return await this.prisma.dismissal.create({
  //         data: {
  //           ...dismissalData,
  //           dateToDay: new Date(),
  //           month: month.toString(),
  //           year: year.toString(),
  //           globalId,
  //         },
  //       });
  //     } else {
  //       // Handle the case where the date is not within the range
  //       return null; // Or throw an error or return a specific value indicating the issue
  //     }
  //   } catch (error) {
  //     throw new DatabaseError("Error retrieving dismissal.", error);
  //   }
  // }

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
        where: { id }
      })
      if (!dismissal) {
        throw new NotFoundError(`Dismissal with id ${id} not found.`)
      }
      const dismissalMonth = dismissal.month

      return await this.prisma.dismissal.update({
        where: { id },
        data: {
          delete: true,
          version: { increment: 1 } // Increment version for conflict resolution
        }
      })
      return dismissalMonth
    } catch (error) {
      throw new DatabaseError('Error deleting dismissal.', error)
    }
  }
}
module.exports = DismissalService
