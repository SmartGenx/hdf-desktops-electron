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
const axios = require('axios')

const path = require('path')
const {
  uploadFileToS3,
  checkFileExistenceInS3,
  listFilesInS3Bucket,
  downloadFileFromS3
} = require('../server/middleware/upload') // Ensure you have an AttachmentController
const sanitize = require('sanitize-filename')
const dotenv = require('dotenv')
const { console } = require('inspector')
dotenv.config()

class DatabaseService {
  constructor() {
    // Initialize both Prisma clients for local and cloud databases
    this.localPrisma = new PrismaClient({
      datasources: {
        db: { url: 'postgresql://postgres:12345@localhost:5432/hdf-production?schema=public' }

      }
    })
    this.cloudPrisma = new PrismaClient({
      datasources: {
        db: { url: 'postgresql://postgres:123456789@3.110.166.135:5432/hdf?schema=public' }
      },
      __internal: {
        engine: {
          maxConnections: 20 // Adjust as needed
        }
      }
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
    console.log('🚀 ~ DatabaseService ~ switchDatabaseBasedOnConnectivity ~ this.isOnline():')
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
        { email: 'admin@hdfye.org', role: 'Admin', name: 'المدير' },
        { email: 'coordinator@hdfye.org', role: 'Coordinator', name: 'المنسق' },
        { email: 'pharmacist@hdfye.org', role: 'Pharmacist', name: ' الصيدلاني' }
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
      return false // لم تتم المزامنة
    }
    try {
      // الحصول على وقت آخر مزامنة
      const syncStatus = await this.localPrisma.syncStatus.findUnique({
        where: { modelName }
      })
      const lastSyncedAt = syncStatus ? syncStatus.lastSyncedAt : new Date(0)

      // جلب السجلات المحلية التي تم إنشاؤها أو تعديلها بعد آخر مزامنة
      const localRecords = await this.localPrisma[modelName].findMany({
        where: {
          OR: [{ createdAt: { gt: lastSyncedAt } }, { lastModified: { gt: lastSyncedAt } }]
        }
      })

      // مؤشر لنجاح المزامنة
      let allRecordsSynced = true
      let recordsProcessed = false // مؤشر لمعرفة ما إذا تمت معالجة سجلات

      // معالجة كل سجل على حدة
      for (const record of localRecords) {
        try {
          await this.cloudPrisma.$transaction(async (prisma) => {
            const cloudRecord = await prisma[modelName].findUnique({
              where: { globalId: record.globalId }
            })

            if (!cloudRecord || cloudRecord.lastModified < record.lastModified) {
              const { id, ...dataForSync } = record // استبعاد الـ id المحلي
              if (cloudRecord) {
                // تحديث السجل السحابي إذا كان قديمًا
                await prisma[modelName].update({
                  where: { globalId: record.globalId },
                  data: {
                    ...dataForSync,
                    lastModified: new Date() // تحديث lastModified
                  }
                })
              } else {
                // إنشاء سجل جديد في السحابة
                await prisma[modelName].create({
                  data: {
                    ...dataForSync,
                    globalId: record.globalId
                  }
                })
              }
              recordsProcessed = true // تمت معالجة سجل واحد على الأقل
            }
          })
        } catch (recordError) {
          console.error(`فشل مزامنة السجل بالمعرف ${record.globalId}:`, recordError)
          allRecordsSynced = false
          // يمكنك إضافة منطق إضافي لمعالجة الأخطاء إذا لزم الأمر
        }
      }

      if (!allRecordsSynced) {
        throw new Error(`فشلت مزامنة بعض السجلات في الجدول ${modelName}`)
      }

      return recordsProcessed // إرجاع ما إذا تمت معالجة سجلات
    } catch (error) {
      console.error(`فشل المزامنة للجدول ${modelName}:`, error)
      throw error // إعادة رمي الخطأ لمنع تحديث lastSyncedAt
    }
  }

  async fetchUpdatesFromServer(modelName) {
    const online = await this.isOnline()
    if (!online) {
      console.log(`تخطي المزامنة للجدول ${modelName} بسبب عدم الاتصال.`)
      return false // لم تتم المزامنة
    }
    try {
      // الحصول على وقت آخر مزامنة
      const syncStatus = await this.localPrisma.syncStatus.findUnique({
        where: { modelName }
      })
      const lastSyncedAt = syncStatus ? syncStatus.lastSyncedAt : new Date(0)

      // جلب السجلات السحابية التي تم إنشاؤها أو تعديلها بعد آخر مزامنة
      const updates = await this.cloudPrisma[modelName].findMany({
        where: {
          OR: [{ createdAt: { gt: lastSyncedAt } }, { lastModified: { gt: lastSyncedAt } }]
        }
      })

      if (updates.length === 0) {
        console.log(`لا توجد تحديثات للجدول ${modelName}`)
        return false // لا توجد تحديثات
      }

      // مؤشر لنجاح المزامنة
      let allUpdatesApplied = true
      let updatesApplied = false // مؤشر لمعرفة ما إذا تمت معالجة تحديثات

      // بدء معاملة في قاعدة البيانات المحلية
      await this.localPrisma.$transaction(async (prisma) => {
        for (const update of updates) {
          try {
            const existingRecord = await prisma[modelName].findUnique({
              where: { globalId: update.globalId }
            })
            if (!existingRecord) {
              const {id, ...dataForCreate} = update
              // السجل غير موجود محليًا، لذا يجب إنشاؤه
              await prisma[modelName].create({
                data: {
                  ...dataForCreate,
                  globalId: update.globalId
                }
              })
              updatesApplied = true // تمت معالجة تحديث
            } else if (existingRecord.lastModified < update.lastModified) {
              // السجل موجود ولكنه قديم، لذا يجب تحديثه
              const { id, ...dataForUpdate } = update
              await prisma[modelName].update({
                where: { globalId: update.globalId },
                data: dataForUpdate
              })
              updatesApplied = true // تمت معالجة تحديث
            }
          } catch (updateError) {
            console.error(
              `فشل تطبيق التحديث للسجل بالمعرف ${update.globalId}:`,
              updateError.message
            )
            allUpdatesApplied = false
            // يمكنك إضافة منطق إضافي لمعالجة الأخطاء إذا لزم الأمر
            // يمكنك اختيار إعادة رمي الخطأ لإيقاف المعاملة بالكامل
            throw updateError
          }
        }
      })

      if (!allUpdatesApplied) {
        throw new Error(`فشلت بعض التحديثات للجدول ${modelName}`)
      }

      return updatesApplied // إرجاع ما إذا تمت معالجة تحديثات
    } catch (error) {
      console.error(`فشل جلب التحديثات للجدول ${modelName}:`, error.message)
      throw error // إعادة رمي الخطأ لمنع تحديث lastSyncedAt
    }
  }

  async updateLastSyncedAt(modelName) {
    try {
      const response = await axios.get(
        'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Riyadh'
      )
      const data = response.data
      console.log('🚀 ~ updateLastSyncedAt ~ currentTime:', data.dateTime)
      console.log('🚀 ~ updateLastSyncedAt ~ currentTime:', new Date())

      await this.localPrisma.syncStatus.upsert({
        where: { modelName },
        update: { lastSyncedAt: new Date(data.dateTime) },
        create: { modelName, lastSyncedAt: new Date(data.dateTime) }
      })
      console.log(`The last synchronization time for ${modelName} was successfully updated.`)
    } catch (error) {
      console.error(`فشل تحديث وقت آخر مزامنة للجدول ${modelName}:`, error)
    }
  }

  async synchronizeS3ToLocal() {
    try {
      const prisma = await this.getPrismaClient()
      const profileDir = 'D:\\Profiles' // Adjust the path to your directory

      // Fetch the list of files from S3
      const s3Files = await listFilesInS3Bucket('hdf-production')

      const downloadPromises = s3Files.map(async (file) => {
        try {
          const sanitizedFileName = sanitize(file.Key)
          const localFilePath = path.join(profileDir, sanitizedFileName)

          // Check if the file name exists in the Attachment or Prescription tables
          const attachmentExists = await prisma.attachment.findFirst({
            where: { attachmentFile: `D:\\Profiles\\${file.Key}` }
          })
          console.log(
            '🚀 ~ DatabaseService ~ downloadPromises ~ attachmentExists:',
            attachmentExists
          )

          const prescriptionExists = await prisma.prescription.findFirst({
            where: { attachedUrl: `D:\\Profiles\\${file.Key}` }
          })

          // If the file does not exist in either table, download it from S3
          if (attachmentExists || prescriptionExists) {
            // If downloadFileFromS3 writes the file directly
            await downloadFileFromS3('hdf-production', file.Key, localFilePath)
            console.log(`File "${file.Key}" downloaded to local directory.`)
          } else {
            console.log(`File "${file.Key}" exists in the database. Skipping download.`)
          }
        } catch (fileError) {
          console.error(`Failed to download file: ${file.Key}`, fileError)
        }
      })

      await Promise.all(downloadPromises)
    } catch (error) {
      console.error('Failed to synchronize S3 files to local directory:', error)
    }
  }

  async synchronizeLocalToS3() {
    try {
      const prisma = await this.getPrismaClient()
      const profileDir = 'D:\\Profiles' // Adjust the path to your directory
      const files = await fs.readdir(profileDir)

      const uploadPromises = files.map(async (file) => {
        try {
          const filePath = path.join(profileDir, file)
          const fileBuffer = await fs.readFile(filePath)

          // Check if the file name exists in S3
          const isFileExistInS3 = await checkFileExistenceInS3('hdf-production', file)

          // if (!isFileExistInS3) {
          // Check if the file name exists in the Attachment or Prescription tables
          const attachmentExists = await prisma.attachment.findFirst({
            where: { attachmentFile: `D:\\Profiles\\${file}` }
          })

          const prescriptionExists = await prisma.prescription.findFirst({
            where: { attachedUrl: `D:\\Profiles\\${file}` }
          })
          console.log(
            '🚀 ~ DatabaseService ~ uploadPromises ~ prescriptionExists:',
            prescriptionExists
          )

          // If the file does not exist in either table, upload it to S3
          if (attachmentExists || prescriptionExists) {
            const mimeType = 'application/octet-stream' // Set to a default MIME type
            await uploadFileToS3('hdf-production', file, fileBuffer, mimeType)
            console.log(`File "${file}" uploaded to S3.`)
          } else {
            console.log(`File "${file}" not exists in the database. Skipping upload.`)
          }
        } catch (fileError) {
          console.error(`Failed to process file: ${file}`, fileError)
        }
      })

      await Promise.all(uploadPromises)
    } catch (error) {
      console.error('Failed to synchronize local files to S3:', error)
    }
  }

  async hasPendingSyncData() {
    const tables = [
      'role',
      'user',
      'category',
      'governorate',
      'directorate',
      'pharmacy',
      'square',
      'disease',
      'applicant',
      'accredited',
      'diseasesApplicants',
      'prescription',
      'attachment',
      'dismissal'
    ]

    for (const table of tables) {
      const syncStatus = await this.localPrisma.syncStatus.findUnique({
        where: { modelName: table }
      })
      const lastSyncedAt = syncStatus ? syncStatus.lastSyncedAt : new Date(0)

      const countlocal = await this.cloudPrisma[table].count({
        where: {
          OR: [{ createdAt: { gt: lastSyncedAt } }, { lastModified: { gt: lastSyncedAt } }]
        }
      })

      const countCloud = await this.localPrisma[table].count({
        where: {
          OR: [{ createdAt: { gt: lastSyncedAt } }, { lastModified: { gt: lastSyncedAt } }]
        }
      })
      if (countlocal > 0 || countCloud > 0) {
        return true
      }
    }
    return false
  }
}
const databaseService = new DatabaseService()

module.exports = {
  databaseService
}
