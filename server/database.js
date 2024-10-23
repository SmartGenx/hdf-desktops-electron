const { PrismaClient } = require('@prisma/client')
const util = require('util')
const dns = require('dns')
const dnsLookup = util.promisify(dns.lookup)
const AuthService = require('../server/services/AuthService') // Adjust this path as necessary
const GovernorateService = require('../server/services/governorateService') // Adjust this path as necessary
const DirectorateService = require('../server/services/directorateService') // Adjust this path as necessary
const CategoryService = require('../server/services/categoryService') // Adjust this path as necessary
const ApplicantService = require('../server/services/applicantService') // Adjust this path as necessary
const SquareServices = require('../server/services/squareServices') // Adjust this path as necessary
const PharmacyService = require('../server/services/pharmacyService') // Adjust this path as necessary
const DismissalServices = require('../server/services/dismissalServices') // Adjust this path as necessary
const AccreditedServices = require('../server/services/accreditedServices') // Adjust this path as necessary
const DiseasesApplicantsServices = require('../server/services/diseasesApplicantsServices') // Adjust this path as necessary
const DiseaseServices = require('../server/services/diseaseServices') // Adjust this path as necessary
const RoleServices = require('../server/services/roleServices') // Adjust this path as necessary
const PrescriptionService = require('../server/services/prescriptionServices') // Adjust this path as necessary
const AttachmentServiceService = require('../server/services/attachmentServices') // Adjust this path as necessary
const statisticsServices = require('../server/services/statisticsServices') // Adjust this path as necessary
const backupServices = require('../server/services/backupServices') // Adjust this path as necessary
const { v4 } = require('uuid') // Make sure to import uuid
const bcrypt = require('bcryptjs')
const fs = require('fs').promises
const AWS = require('aws-sdk')
const path = require('path')
const { uploadFileToS3, checkFileInS3, downloadFileFromS3 } = require('../server/middleware/upload') // Ensure you have an AttachmentController

const dotenv = require('dotenv')

dotenv.config()

class DatabaseService {
  constructor() {
    // Initialize both Prisma clients for local and cloud databases
    this.localPrisma = new PrismaClient({
      datasources: {
        db: { url: 'postgresql://postgres:sami2020@localhost:5432/Hdf_electron?schema=public' }
        // db: { url: 'postgresql://postgres:123456789@3.108.217.185:5432/hdf-web?schema=public' }
      }
    })
    this.cloudPrisma = new PrismaClient({
      datasources: {
        db: { url: 'postgresql://postgres:123456789@3.108.217.185:5432/hdf-web?schema=public' }
      },
      __internal: {
        engine: {
          maxConnections: 20, // Adjust as needed
        },
      },
    })

    this.authService = null
    // Directly initialize services to use the correct Prisma client based on connectivity
    this.initializeServices().catch(console.error)
  }

  async isOnline() {
    try {
      await dnsLookup('google.com')
      return true
    } catch (error) {
      return false
    }
  }

  async getPrismaClient() {
    return this.localPrisma
  }
  async initializeServices() {
    const prisma = await this.getPrismaClient()
    this.authService = new AuthService(prisma)
    this.governorateService = new GovernorateService(prisma)
    this.directorateService = new DirectorateService(prisma)
    this.categoryService = new CategoryService(prisma)
    this.applicantService = new ApplicantService(prisma)
    this.squareServices = new SquareServices(prisma)
    this.pharmacyService = new PharmacyService(prisma)
    this.dismissalServices = new DismissalServices(prisma)
    this.accreditedServices = new AccreditedServices(prisma)
    this.diseasesApplicantsServices = new DiseasesApplicantsServices(prisma)
    this.diseaseServices = new DiseaseServices(prisma)
    this.roleServices = new RoleServices(prisma)
    this.PrescriptionService = new PrescriptionService(prisma)
    this.attachmentServiceService = new AttachmentServiceService(prisma)
    this.statisticsServices = new statisticsServices(prisma)
    this.backupServices = new backupServices(prisma)
  }

  async switchDatabaseBasedOnConnectivity() {
    await this.initializeServices()
  }

  getAuthService() {
    if (!this.authService) {
      throw new Error(
        'AuthService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.authService
  }
  getGovernorateService() {
    if (!this.governorateService) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.governorateService
  }
  getDirectorateService() {
    if (!this.directorateService) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.directorateService
  }
  getCategoryService() {
    if (!this.categoryService) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.categoryService
  }
  getApplicantService() {
    if (!this.applicantService) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.applicantService
  }
  getSquareService() {
    if (!this.squareServices) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.squareServices
  }
  getPharmacyService() {
    if (!this.pharmacyService) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.pharmacyService
  }
  getDismissalService() {
    if (!this.dismissalServices) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.dismissalServices
  }
  getAccreditedService() {
    if (!this.accreditedServices) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.accreditedServices
  }
  getDiseasesApplicantsService() {
    if (!this.diseasesApplicantsServices) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.diseasesApplicantsServices
  }
  getDiseaseService() {
    if (!this.diseaseServices) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.diseaseServices
  }
  getRoleService() {
    if (!this.roleServices) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.roleServices
  }
  getPrescriptionService() {
    if (!this.PrescriptionService) {
      throw new Error(
        'governorateService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.PrescriptionService
  }
  getAttachmentService() {
    if (!this.attachmentServiceService) {
      throw new Error(
        'attachmentService has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.attachmentServiceService
  }
  getStatisticsServices() {
    if (!this.statisticsServices) {
      throw new Error(
        'statisticsServices has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.statisticsServices
  }
  getbackupServices() {
    if (!this.backupServices) {
      throw new Error(
        'statisticsServices has not been initialized. Please ensure database connectivity is established.'
      )
    }
    return this.backupServices
  }
  async user() {
    try {
      const prisma = await this.getPrismaClient()

      // Define role names and user details
      const roles = ['Admin', 'Coordinator', 'Pharmacist']
      const users = [
        { email: 'admin@hdfye.org', role: 'Admin', name: 'Admin User' },
        { email: 'coordinator@hdfye.org', role: 'Coordinator', name: 'Coordinator User' },
        { email: 'pharmacist@hdfye.org', role: 'Pharmacist', name: 'Pharmacist User' }
      ]

      // Create roles if they do not exist
      for (const roleName of roles) {
        const role = await prisma.role.findFirst({
          where: { name: roleName }
        })

        if (!role) {
          const globalId = `${process.env.LOCAL_DB_ID}-${roleName}`

          await prisma.role.create({
            data: {
              name: roleName,
              globalId
            }
          })
        }
      }

      // Create users if they do not exist
      for (const userData of users) {
        const role = await prisma.role.findFirst({
          where: { name: userData.role }
        })

        if (!role) {
          continue // Skip to the next iteration if the role isn't found
        }

        const user = await prisma.user.findFirst({
          where: {
            email: userData.email,
            deleted: false
          }
        })

        if (!user) {
          const hashedPassword = await bcrypt.hash(`${userData.role}!@#123`, 10) // Set secure passwords
          // const profileImage = img.blurDataURL; // Default profile image
          const timestamp = Date.now()
          const uniqueId = v4()
          const globalId = `${process.env.LOCAL_DB_ID}-${userData.role}-${uniqueId}-${timestamp}`

          const newUser = await prisma.user.create({
            data: {
              name: userData.name,
              email: userData.email,
              password: hashedPassword,
              roleGlobalId: role.globalId, // Now guaranteed to be not undefined
              // profileImage,
              globalId: globalId,
              deleted: false
              // Set additional default values as needed
            }
          })
        }
      }
      return
    } catch (error) {
      console.error('Failed to seed roles and users:', error)
      return
    }
  }

  async synchronizeTable(modelName) {
    const online = await this.isOnline()
    if (!online) {
      return
    }
    try {
      const localRecords = await this.localPrisma[modelName].findMany({
        // Include conditions to select records that need synchronization
      })

      // Use interactive transaction
      await this.cloudPrisma.$transaction(async (prisma) => {
        for (const record of localRecords) {
          const cloudRecord = await prisma[modelName].findUnique({
            where: { globalId: record.globalId }
          })

          // Only synchronize if the cloud record is missing or outdated
          if (!cloudRecord || (cloudRecord && cloudRecord.version < record.version)) {
            const { id, ...dataForSync } = record // Exclude local id from synchronization data
            if (cloudRecord) {
              // Update cloud record if it exists but is outdated
              await prisma[modelName].update({
                where: { globalId: record.globalId },
                data: {
                  ...dataForSync,
                  version: record.version,
                  lastModified: new Date()
                }
              })
            } else {
              // Insert new record into cloud if it doesn't exist
              await prisma[modelName].create({
                data: {
                  ...dataForSync,
                  globalId: record.globalId // Ensure globalId is included
                }
              })
            }
          }
        }
      })
    } catch (error) {
      console.error(`Synchronization failed for ${modelName}:`, error)
    }
  }

  async fetchUpdatesFromServer(modelName) {
    const online = await this.isOnline()
    if (!online) {
      return
    }
    try {
      const updates = await this.cloudPrisma[modelName].findMany({
        // Include conditions to select updated records, possibly based on version or timestamps
      })

      // Use interactive transaction
      await this.localPrisma.$transaction(async (prisma) => {
        for (const update of updates) {
          const existingRecord = await prisma[modelName].findUnique({
            where: { globalId: update.globalId }
          })

          // Only apply update if it's a newer version
          if (!existingRecord || (existingRecord && existingRecord.version < update.version)) {
            const { id, ...dataForUpdate } = update // Exclude cloud id from update data
            if (existingRecord) {
              // Update local record if it exists but is outdated
              await prisma[modelName].update({
                where: { globalId: update.globalId },
                data: dataForUpdate
              })
            } else {
              // Insert new record locally if it doesn't exist
              await prisma[modelName].create({
                data: {
                  ...dataForUpdate,
                  globalId: update.globalId // Ensure globalId is included
                }
              })
            }
          }
        }
      })
    } catch (error) {
      console.error(`Failed to fetch updates for ${modelName}:`, error.message)
    }
  }

  async synchronizeLocalToS3() {
    try {
      const profileDir = 'C:Profiles' // Adjust the path to your directory
      const files = await fs.readdir(profileDir)

      const uploadPromises = files.map(async (file) => {
        try {
          const filePath = path.join(profileDir, file)
          const fileBuffer = await fs.readFile(filePath)
          const mimeType = 'application/octet-stream' // Set to a default MIME type
          await uploadFileToS3('smartgenx', file, fileBuffer, mimeType)
        } catch (fileError) {
          console.error(`Failed to upload file: ${file}`, fileError)
        }
      })

      Promise.all(uploadPromises)
    } catch (error) {
      console.error('Failed to synchronize local files to S3:', error)
    }
  }

  async synchronizeS3ToLocal() {
    try {
      AWS.config.update({
        region: 'ap-south-1',
        accessKeyId: 'AKIAXHPAJTZ3RVODGSAL',
        secretAccessKey: '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'
      })
      const s3 = new AWS.S3()
      const bucketName = 'smartgenx'
      const profileDir = 'C:Profiles' // Adjust the path to your directory

      // List objects in the S3 bucket
      const listParams = {
        Bucket: bucketName
      }
      const data = await s3.listObjectsV2(listParams).promise()
      const files = data.Contents.map((item) => item.Key)

      const downloadPromises = files.map(async (file) => {
        try {
          const downloadPath = path.join(profileDir, file)
          await downloadFileFromS3(bucketName, file, downloadPath)
        } catch (fileError) {
          console.error(`Failed to download file: ${file}`, fileError)
        }
      })

      Promise.all(downloadPromises)
    } catch (error) {
      console.error('Failed to synchronize S3 files to local:', error)
    }
  }
}
const databaseService = new DatabaseService()

module.exports = {
  databaseService
}
