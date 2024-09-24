const { databaseService } = require('../database') // Adjust the import path as needed
const { validationResult } = require('express-validator')
const ApiError = require('../errors/ApiError')
const DatabaseError = require('../errors/DatabaseError')
const ValidationError = require('../errors/ValidationError')
const NotFoundError = require('../errors/NotFoundError')
const ejs = require('ejs')
const bwipjs = require('bwip-js')
const puppeteer = require('puppeteer')
const ExcelJS = require('exceljs')
const path = require('path')
const fs = require('fs')
const { number } = require('zod')
class AccreditedController {
  // Fetch all accreditations
  async fileUploadController(req, res, next) {
    try {
      const { sourcePath, localDir, accreditedId, bucketName } = req.body // Extracting data from request body
      // Call your function with the extracted parameters
      const result = await uploadOrSaveFile(sourcePath, localDir, accreditedId, bucketName)
      // Send a success response with the result
      res.status(200).json({ message: result })
    } catch (error) {
      // Log the error and send an error response
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
  async filterAccredited(req, res, next) {
    try {
      // Extract query parameters from the request
      const { squareId, location, docter, state } = req.query

      // Convert squareId to an integer if present
      const squareIdv = parseInt(squareId, 10)

      // Assuming you have a service for Accredited similar to ApplicantService
      const AccreditedService = databaseService.getAccreditedService()

      // Call the service function with the query parameters
      const accreditedRecords = await AccreditedService.filterAccreditedByDateAndLocation(
        squareIdv,
        location,
        docter,
        state
      )

      // Respond with the filtered list of accredited records
      res.json(accreditedRecords)
    } catch (error) {
      console.error('Error filtering accredited records:', error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async getAllOrSearchApplicants(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const searchTerm = req.query // Assuming the search term comes as a query parameter
      const Accredited = await AccreditedService.searchAccreditations(searchTerm)
      res.status(200).json(Accredited)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
  async getAllApplicants(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const searchTerm = req.query // Assuming the search term comes as a query parameter
      const Accredited = await AccreditedService.getAllAccreditations(searchTerm)
      res.status(200).json(Accredited)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Fetch a single accreditation by its ID
  async getAccreditationById(req, res, next) {
    const id = req.params.id
    const AccreditedService = databaseService.getAccreditedService()

    try {
      const accreditation = await AccreditedService.getAccreditationById(id)
      if (!accreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`))
      }
      res.status(200).json(accreditation)
    } catch (error) {
      console.error(error)
      next(error)
    }
  }

  async countAllAccredited(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      const count = await AccreditedService.countAllAccredited()
      res.json({ count })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Create a new accreditation
  async createAccreditation(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const fileAtch = req.atch
      const filePt = req.pt
      const AccreditedData = req.body
      const newAccreditation = await AccreditedService.createAccreditation(
        AccreditedData,
        fileAtch,
        filePt
      )

      res.status(201).json(newAccreditation)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Update an existing accreditation
  async updateAccreditation(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }
      const fileAtch = req.atch
      const filePt = req.pt

      const id = req.params.id
      const AccreditedData = req.body
      const updatedAccreditation = await AccreditedService.updateAccreditation(id, AccreditedData,fileAtch, filePt)

      if (!updatedAccreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`))
      }

      res.status(200).json(updatedAccreditation)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
  async updateAccreditationState(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return next(new ValidationError('Validation Failed', errors.array()))
      }

      const id = req.params.id
      const { state } = req.body

      const updatedAccreditation = await AccreditedService.updateAccreditationState(id, state)

      if (!updatedAccreditation) {
        return next(new NotFoundError(`Accreditation with id ${id} not found.`))
      }

      res.status(200).json(updatedAccreditation)
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  // Delete an accreditation by ID
  async deleteAccreditation(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      // Extract the accreditation ID from the request parameters and convert it to a number
      const id = req.params.id
      // Use the AccreditedService to delete the accreditation by ID and retrieve the name of the deleted accreditation
      const name = await AccreditedService.deleteAccreditation(id)
      // Send a success response with the name of the deleted accreditation
      res.status(200).json({
        message: `The accreditation '${name}' has been successfully deleted`
      })
    } catch (error) {
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async AccreditedByPrescription(req, res, next) {
    const AccreditedService = databaseService.getAccreditedService()
    try {
      // Ensure that 'directorateId' is correctly extracted from the request parameters
      // 'req.params' is an object, so you need to specify the key to get the desired parameter
      // // Assuming the route parameter is named 'directorateId' as in '/someRoute/:directorateId'

      const Accredited = await AccreditedService.AccreditedByPrescriptionServer()
      res.status(200).json(Accredited)
    } catch (error) {
      console.error(error)
      // Pass the error to the error handling middleware
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async exportAllBarcodeCardToPDFById(req, res, next) {
    try {
      // Example object (in real scenario, fetch this from your database)
      const id = req.params.id
      const AccreditedService = databaseService.getAccreditedService()
      const accredited = await AccreditedService.getAccreditationById(id)
      const dta = {
        number: accredited.numberOfRfid
      }
      res.status(200).send(dta)

      // if (!accredited) {
      //   return res.status(400).send({ error: 'No data provided for the barcodes' })
      // }

      // // Generate the barcode
      // const pngBuffer = await bwipjs.toBuffer({
      //   bcid: 'code128',
      //   text: `${accredited.numberOfRfid}`,
      //   scale: 3,
      //   height: 10,
      //   textxalign: 'center'
      // })
      // const barcodeData = pngBuffer.toString('base64')
      // const barcodeImageSrc = `data:image/png;base64,${barcodeData}`

      // const imagePath = path.join(__dirname, '..', '..', 'static', 'images', 'logo.png')
      // const imageData = fs.readFileSync(imagePath)
      // const base64Image = imageData.toString('base64')
      // const logoImageSrc = `data:image/png;base64,${base64Image}`
      // // Render the HTML content using EJS
      // const templatePath = path.join(__dirname, '..', '..', 'views', 'accreditedsCardOne.ejs')
      // const htmlContent = await ejs.renderFile(templatePath, {
      //   accredited,
      //   barcodeImageSrc,
      //   logoImageSrc
      // })
      // const browser = await puppeteer.launch({
      //   headless: true,
      //   args: ['--no-sandbox', '--disable-setuid-sandbox']
      // })
      // const page = await browser.newPage()
      // await page.setDefaultNavigationTimeout(60000) // Set default navigation timeout to 60 seconds

      // try {
      //   await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
      // } catch (error) {
      //   console.error('Failed to set page content', error)
      //   throw error
      // }

      // let pdfBuffer
      // try {
      //   pdfBuffer = await page.pdf({
      //     format: 'A4',
      //     printBackground: true,
      //     margin: { top: '20mm', right: '20mm', bottom: '20mm', left: '20mm' }
      //   })
      // } catch (error) {
      //   console.error('Failed to generate PDF', error)
      //   throw error
      // }

      // await browser.close()

      // // Send the PDF as response
      // res.setHeader('Content-Type', 'application/pdf')
      // res.setHeader('Content-Disposition', 'attachment; filename=accredited_barcode_card.pdf')
      // res.send(pdfBuffer)
    } catch (error) {
      console.error('Failed to generate the barcode card PDF', error)
      next(new ApiError(500, 'InternalServer', error))
    }
  }

  async exportAllBarcodeCardToPDF(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const accrediteds = await AccreditedService.getAllAccreditations()
      let card = []
      for (const data of accrediteds) {
        card.push({ number: data.numberOfRfid })
      }
      res.status(200).json(card)
      console.log('🚀 ~ AccreditedController ~ exportAllBarcodeCardToPDF ~ card:', card)

      //   if (!accrediteds || accrediteds.length === 0) {
      //     return res.status(400).send({ error: 'No data provided for the barcodes' })
      //   }
      //   let cardHtml = '<div style="display: flex; flex-wrap: wrap; gap: 1mm;">'

      //   for (const data of accrediteds) {
      //     // Generate the barcode
      //     const pngBuffer = await bwipjs.toBuffer({
      //       bcid: 'code128',
      //       text: `${data.numberOfRfid}`,
      //       scale: 3,
      //       height: 7,
      //       // includetext: true,
      //       textxalign: 'center'
      //     })
      //     const barcodeData = pngBuffer.toString('base64')
      //     const barcodeImageSrc = `data:image/png;base64,${barcodeData}`

      //     const imagePath = path.join(__dirname, '..', '..', 'static', 'images', 'logo.png')
      //     const imageData = fs.readFileSync(imagePath)
      //     const base64Image = imageData.toString('base64')
      //     const logoImageSrc = `data:image/png;base64,${base64Image}`
      //     // Render the HTML content using EJS
      //     const templatePath = path.join(__dirname, '..', '..', 'views', 'accreditedsCard.ejs')
      //     const cardInstance = await ejs.renderFile(templatePath, {
      //       data,
      //       barcodeImageSrc,
      //       logoImageSrc
      //     })
      //     // Card style adjusted for size
      //     cardHtml += `<div style="width: 95mm; height: 100mm;">${cardInstance}</div>`
      //   }
      //   cardHtml += '</div>'
      //   const browser = await puppeteer.launch({
      //     headless: true,
      //     args: ['--no-sandbox', '--disable-setuid-sandbox']
      //   })
      //   const page = await browser.newPage()
      //   await page.setDefaultNavigationTimeout(60000) // Set default navigation timeout to 60 seconds
      //   try {
      //     await page.setContent(cardHtml, { waitUntil: 'networkidle0' })
      //   } catch (error) {
      //     console.error('Failed to set page content', error)
      //     throw error
      //   }

      //   let pdfBuffer
      //   try {
      //     pdfBuffer = await page.pdf({
      //       format: 'A4',
      //       printBackground: true,
      //       margin: { top: '5mm', right: '5mm', bottom: '5mm', left: '5mm' }
      //     })
      //   } catch (error) {
      //     console.error('Failed to generate PDF', error)
      //     throw error
      //   }

      //   await browser.close()

      //   res.setHeader('Content-Type', 'application/pdf')
      //   res.setHeader('Content-Disposition', 'attachment; filename=accrediteds_barcode_cards.pdf')
      //   res.send(pdfBuffer)
    } catch (error) {
      console.error('Failed to generate the barcode card PDF', error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async AccreditedByPrescriptionServers(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const dataFilter = req.query

      const accrediteds = await AccreditedService.AccreditedByPrescriptionServer(dataFilter)
      res.status(200).json(accrediteds)
    } catch (error) {
      console.error('Failed ', error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async exportAllAccreditedsToPDF(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const dataFillter = req.query

      const accrediteds = await AccreditedService.AccreditedByPrescriptionServer(dataFillter)

      // Ensure applicants data is available
      if (!accrediteds || accrediteds.length === 0) {
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

      const fullPath = path.join(__dirname, '..', '..', 'views', 'accrediteds.ejs')
      const htmlContent = await ejs.renderFile(fullPath, {
        accrediteds: accrediteds,
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
      res.setHeader('Content-Disposition', 'attachment; filename="accrediteds.pdf"')
      res.send(pdfBuffer)
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }

  async exportAllAccreditedByPrescriptionToExcel(req, res, next) {
    try {
      const AccreditedService = databaseService.getAccreditedService()
      const dataFillter = req.query
      const accreditedData = await AccreditedService.AccreditedByPrescriptionServer(dataFillter) // Assume there's a function to fetch data by prescription
      // Convert each accredited data to the AccreditedByPrescription model
      const accreditedList = accreditedData
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Accredited by Prescription')
      worksheet.columns = [
        { header: 'الاسم', key: 'name', width: 30 },
        { header: 'نوع المرض', key: 'disease', width: 30 },
        { header: 'المنطقة', key: 'directorate', width: 30 },
        { header: 'رقم الجوال', key: 'phoneNumber', width: 35 },
        {
          header: 'تاريخ تقديم الوصفة',
          key: 'orescriptionDate',
          width: 40,
          style: { numFmt: 'mm/dd/yyyy' }
        },
        {
          header: 'تاريخ انتهاء الوصفة',
          key: 'renewalDate',
          width: 20,
          style: { numFmt: 'mm/dd/yyyy' }
        },
        { header: 'عدد الايام المتبقية', key: 'days', width: 10 },
        { header: 'عدد الاشهر النتبقية', key: 'Months', width: 10 }
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

      accreditedList.forEach((accredited) => {
        worksheet.addRow({
          name: accredited.name,
          disease: accredited.disease,
          directorate: accredited.directorate,
          phoneNumber: accredited.phoneNumber,
          orescriptionDate: new Date(accredited.orescriptionDate),
          renewalDate: new Date(accredited.renewalDate),
          days: accredited.days,
          Months: accredited.Months
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
      res.setHeader('Content-Disposition', 'attachment; filename="accredited_by_prescription.xlsx"')

      await workbook.xlsx.write(res)
      res.end()
    } catch (error) {
      console.error(error)
      next(new ApiError(500, 'InternalServer', 'Internal Server Error'))
    }
  }
}

module.exports = new AccreditedController()
