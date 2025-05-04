const { databaseService } = require('../../database') // Adjust the import path as needed
const { validationResult } = require('express-validator')
const ApiError = require('../../errors/ApiError')
const DatabaseError = require('../../errors/DatabaseError')
const ValidationError = require('../../errors/ValidationError')
const NotFoundError = require('../../errors/NotFoundError')
const fs = require('fs')
const path = require('path')
// const officegen = require('officegen');
class ApplicantController {
  // Fetch all applicants
  //--
  async ApplicantReportCategory(req, res, next) {
    // try {
      const ApplicantService = databaseService.getApplicantService()
      const applicantfilter = req.query
      const applicantsData = await ApplicantService.ApplicantByCategory(applicantfilter)
      res.status(200).json(applicantsData)
    // } catch (error) {
    //   next(new ApiError(error.message, error.status))
    // }
  }
  async getAllApplicantsUseUpdate(dataFillter) {
    try {
      const page = dataFillter?.page
      const pageSize = dataFillter?.pageSize
      delete dataFillter?.page
      delete dataFiltlter?.pageSize
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
  //--
  async countAllApplicants(req, res,next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const count = await ApplicantService.countAllApplicants()
      res.json({ count })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  //no need
  async getApplicantMonthlyGenderCounts(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const applicantMonthlyGenderCountsWithSquareCount =
        await ApplicantService.getApplicantMonthlyGenderCounts()
      res.json({ applicantMonthlyGenderCountsWithSquareCount })
    } catch (error) {
      // next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
      console.error(error)
      res.status(500).json({ error: 'Internal Server Error' })
    }
  }

  // --

  //**************************************************************************** */

  //--
  async getAllAccreditedAfterDismissal(req, res,next) {
    // try {
      const ApplicantService = databaseService.getApplicantService()
      const filterParams = req.query

      const applicants = await ApplicantService.getAllAccreditedAfterDismissal(filterParams)
      res.status(200).json(applicants)
    // } catch (error) {
    //   next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    // }
  }


  //**************************************************************************** */

  //--

}

module.exports = new ApplicantController()
