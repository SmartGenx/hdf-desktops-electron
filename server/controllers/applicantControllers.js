const { databaseService } = require('../database') // Adjust the import path as needed
const { validationResult } = require('express-validator')
const ApiError = require('../errors/ApiError')
const DatabaseError = require('../errors/DatabaseError')
const ValidationError = require('../errors/ValidationError')
const NotFoundError = require('../errors/NotFoundError')
const ExcelJS = require('exceljs')
const fs = require('fs')
const path = require('path')
const ejs = require('ejs')
const pdf = require('html-pdf')
const puppeteer = require('puppeteer')
// const officegen = require('officegen');
class ApplicantController {
  // Fetch all applicants
  //--
  async ApplicantReportCategory(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const applicantfilter = req.query
      const applicantsData = await ApplicantService.ApplicantByCategory(applicantfilter)
      res.status(200).json(applicantsData)
    } catch (error) {
      next(new ApiError(error.message, error.status))
    }
  }

  async exportApplicantsReportCategoryToExcel(req, res,next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const id = Number(req.params.id)
      const applicantfilter = req.query
      const applicantsData = await ApplicantService.ApplicantByCategory(applicantfilter)
      // res.status(200).json(applicantsData);
      // Convert each applicant data to the ApplicantByCategoryViewModel
      const applicants = applicantsData

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Applicants')

      worksheet.columns = [
        { header: 'الاسم', key: 'name', width: 30 },
        { header: 'نوع المرض', key: 'disease', width: 20 },
        { header: 'المنطقة', key: 'directorate', width: 20 },
        { header: 'رقم الجوال', key: 'phoneNumber', width: 20 },
        {
          header: 'تاريخ التقديم',
          key: 'submissionDate',
          width: 10,
          style: { numFmt: 'mm/dd/yyyy' }
        }
      ]

      // Apply styling to the header row
      worksheet.getRow(1).font = {
        bold: true,
        size: 14,
        color: { argb: 'FFFFFF' }
      }
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0000FF' }
      }

      applicants.forEach((applicant) => {
        const row = worksheet.addRow({
          name: applicant.name,
          disease: applicant.disease,
          directorate: applicant.directorate,
          phoneNumber: applicant.phoneNumber,
          submissionDate: applicant.submissionDate
        })
      })

      // Adjust column width to fit content
      worksheet.columns.forEach((column) => {
        let maxLength = 0
        column.eachCell({ includeEmpty: true }, (cell) => {
          let cellLength = cell.value ? cell.value.toString().length : 10
          if (cellLength > maxLength) {
            maxLength = cellLength
          }
        })
        column.width = maxLength < 10 ? 10 : maxLength
      })

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.setHeader('Content-Disposition', 'attachment; filename="applicants.xlsx"')

      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  //--
  async exportApplicantsReportCategoryToPDF(req, res, next) {
    // try {
    const ApplicantService = databaseService.getApplicantService()
    const applicantfilter = req.query
    const applicants = await ApplicantService.ApplicantByCategory(applicantfilter)

    // Ensure applicants data is available
    if (!applicants || applicants.length === 0) {
      return res.status(404).send('No applicants found.')
    }
    const imagePath = path.join(__dirname, '..', '..', 'static', 'images', '12123212-01.png')
    const imageData = fs.readFileSync(imagePath)
    const base64Image = imageData.toString('base64')
    const logoImageSrc = `data:image/png;base64,${base64Image}`

    const imagePath2 = path.join(__dirname, '..', '..', 'static', 'images', '3232332-03.png')
    const imageData2 = fs.readFileSync(imagePath2)
    const base64Image2 = imageData2.toString('base64')
    const logoImageSrc2 = `data:image/png;base64,${base64Image2}`

    // Render the HTML content from the EJS template with the corrected file name
    const fullPath = path.join(__dirname, '..', '..', 'views', 'applicantByCategory.ejs')
    const htmlContent = await ejs.renderFile(fullPath, {
      applicants: applicants,
      logoImageSrc: logoImageSrc,
      logoImageSrc2: logoImageSrc2
    })

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()

    // Set HTML content and wait for page to render
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

    // Generate PDF from HTML
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true // This sets the page orientation to horizontal
    })

    // Close the browser
    await browser.close()

    // Set headers and send the PDF buffer
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', 'attachment; filename="applicants.pdf"')
    res.send(pdfBuffer)
    // } catch (error) {
    // 	next(new ApiError(500, 'InternalServer', 'Internal Server Error'));
    // }
  }

  //dont delete
  async getAllOrSearchApplicants(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const searchTerm = req.query // Assuming the search term comes as a query parameter
      const applicants = await ApplicantService.getAllApplicants(searchTerm)
      res.status(200).json(applicants)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Fetch a single applicant by its ID
  //--
  async getApplicantById(req, res, next) {
    try {
      const id = req.params.id
      const ApplicantService = databaseService.getApplicantService()
      const applicant = await ApplicantService.getApplicantById(id)
      if (!applicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`))
      }
      res.status(200).json(applicant)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Create a new applicant
  async createApplicant(req, res, next) {
    const ApplicantService = databaseService.getApplicantService()
    try {
      const ApplicantData = req.body
      // Check if all required fields are present in the request body
      if (!ApplicantData) {
        throw new ValidationError('Missing required fields.')
      }
      const newApplicant = await ApplicantService.createApplicant(ApplicantData)
      res.status(201).json(newApplicant)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Update an existing applicant
  async updateApplicant(req, res, next) {
    // try {
      const ApplicantService = databaseService.getApplicantService()
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }

      const id = req.params.id
      const ApplicantData = req.body
      const updatedApplicant = await ApplicantService.updateApplicant(id, ApplicantData)

      if (!updatedApplicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`))
      }

      res.status(200).json(updatedApplicant)
    // } catch (error) {
    //   next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    // }
  }
  async updateApplicantAccredited(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }

      const id = Number(req.params.id)
      const updatedApplicant = await ApplicantService.updateApplicantAccredited(id)

      if (!updatedApplicant) {
        return next(new NotFoundError(`Applicant with id ${id} not found.`))
      }

      res.status(200).json(updatedApplicant)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Delete an applicant by ID
  //-
  async deleteApplicant(req, res, next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const id = req.params.id
      const deletedApplicantName = await ApplicantService.deleteApplicant(id)

      res.status(200).json({
        message: `The applicant '${deletedApplicantName}' has been successfully deleted`
      })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
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
  async exportAllApplicantsByDirectorateToPDF(req, res,next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const params = req.query
      const applicants = await ApplicantService.getAllAccreditedWithParams(params)

      // Ensure applicants data is available
      if (!applicants || applicants.length === 0) {
        return res.status(404).send('No applicants found.')
      }

      // Render the HTML content from the EJS template
      const htmlContent = await ejs.renderFile('views/accreditedsByDirectorate.ejs', {
        applicants: applicants
      })

      // Launch Puppeteer
      const browser = await puppeteer.launch()
      const page = await browser.newPage()

      // Set HTML content and wait for page to render
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

      // Generate PDF from HTML
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true // This sets the page orientation to horizontal
      })

      // Close the browser
      await browser.close()

      // Set headers and send the PDF buffer
      res.setHeader('Content-Type', 'application/pdf')
      // Generate a more generic filename as it includes multiple applicants
      res.setHeader('Content-Disposition', 'attachment; filename="applicants.pdf"')
      res.send(pdfBuffer)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
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
  async exportAllAccreditedAfterDismissal(req, res,next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      // const id = Number(req.params.id);
      const filterParams = req.query
      const applicants = await ApplicantService.getAllAccreditedAfterDismissal(filterParams)
      // res.status(200).json(applicants);

      // Ensure applicants data is available
      if (!applicants || applicants.length === 0) {
        return res.status(404).send('No applicants found.')
      }
      const imagePath = path.join(__dirname, '..', '..', 'static', 'images', '12123212-01.png')
      const imageData = fs.readFileSync(imagePath)
      const base64Image = imageData.toString('base64')
      const logoImageSrc = `data:image/png;base64,${base64Image}`

      const imagePath2 = path.join(__dirname, '..', '..', 'static', 'images', '3232332-03.png')
      const imageData2 = fs.readFileSync(imagePath2)
      const base64Image2 = imageData2.toString('base64')
      const logoImageSrc2 = `data:image/png;base64,${base64Image2}`
      const fullPath = path.join(__dirname, '..', '..', 'views', 'accreditedsByDirectorate.ejs')
      // Render the HTML content from the EJS template
      const htmlContent = await ejs.renderFile(fullPath, {
        applicants: applicants,
        logoImageSrc: logoImageSrc,
        logoImageSrc2: logoImageSrc2
      })

      // Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      })
      const page = await browser.newPage()

      // Set HTML content and wait for page to render
      await page.setContent(htmlContent, { waitUntil: 'networkidle0' })

      // Generate PDF from HTML
      const pdfBuffer = await page.pdf({
        format: 'A4',
        landscape: true // This sets the page orientation to horizontal
      })

      // Close the browser
      await browser.close()

      // Set headers and send the PDF buffer
      res.setHeader('Content-Type', 'application/pdf')
      // Generate a more generic filename as it includes multiple applicants
      res.setHeader('Content-Disposition', 'attachment; filename="applicants.pdf"')
      res.send(pdfBuffer)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  //**************************************************************************** */

  //--
  async exportAllApplicantsByDirectorateToExcel(req, res,next) {
    try {
      const ApplicantService = databaseService.getApplicantService()
      const id = Number(req.params.id)
      const filterParams = req.query
      const applicantsData = await ApplicantService.getAllAccreditedAfterDismissal(filterParams)
      // Convert each applicant data to the ApplicantByDirectorateViewModel
      const applicants = applicantsData

      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Applicants by Directorate')

      worksheet.columns = [
        { header: 'الاسم ', key: 'name', width: 30 },
        { header: 'الجنس', key: 'gender', width: 10 },
        { header: 'نوع المرض', key: 'disease', width: 20 },
        { header: 'المنطقة', key: 'directorate', width: 30 },
        { header: 'رقم الجوال', key: 'phoneNumber', width: 35 },
        { header: 'الحلة العلاج', key: 'state', width: 15 },
        { header: 'المبلغ الاجمالي', key: 'totalAmount', width: 15 },
        { header: 'نسبة الدعم ', key: 'supportRatio', width: 35 },
        { header: 'المبلغ الصافي', key: 'approvedAmount', width: 15 }
      ]

      // Apply styling to the header row
      worksheet.getRow(1).font = {
        bold: true,
        size: 14,
        color: { argb: 'FFFFFF' }
      }
      worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '0000FF' }
      }

      applicants.forEach((applicant) => {
        worksheet.addRow({
          name: applicant.name,
          gender: applicant.gender,
          disease: applicant.disease,
          directorate: applicant.directorate,
          phoneNumber: applicant.phoneNumber,
          state: applicant.state,
          totalAmount: applicant.totalAmount,
          supportRatio: applicant.supportRatio,
          approvedAmount: applicant.approvedAmount
        })
      })

      // Adjust column width to fit content
      worksheet.columns.forEach((column) => {
        let maxLength = 0
        column.eachCell({ includeEmpty: true }, (cell) => {
          let cellLength = cell.value ? cell.value.toString().length : 10
          if (cellLength > maxLength) {
            maxLength = cellLength
          }
        })
        column.width = maxLength < 10 ? 10 : maxLength
      })

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      res.setHeader('Content-Disposition', 'attachment; filename="applicants_by_directorate.xlsx"')

      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
}

module.exports = new ApplicantController()
