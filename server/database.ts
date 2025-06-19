  import {Prisma, PrismaClient } from '@prisma/client'
  import util from 'util'
  import dns from 'dns'
  import bcrypt from 'bcryptjs'
  import { v4 as uuidv4 } from 'uuid'
  import fs from 'fs/promises'
  import path from 'path'
  import axios from 'axios'
  import dotenv from 'dotenv'

  import AuthService from './services/user/AuthService'
  import GovernorateService from './services/systemSetting/governorateService'
  import DirectorateService from './services/systemSetting/directorateService'
  import {CategoryService} from './services/systemSetting/categoryService'
  import ApplicantService from './services/applicant/applicantService'
  import SquareServices from './services/systemSetting/squareServices'
  import PharmacyService from './services/systemSetting/pharmacyService'
  import DismissalServices from './services/dismissal/dismissalServices'
  import AccreditedServices from './services/accreditation/accreditedServices'
  import DiseasesApplicantsServices from './services/applicant/diseasesApplicants/diseasesApplicantsServices'
  import DiseaseServices from './services/systemSetting/diseaseServices'
  import RoleServices from './services/user/roleServices'
  import PrescriptionService from './services/accreditation/prescriptionServices'
  import AttachmentServiceService from './services/attachment/attachmentServices'
  import StatisticsServices from './services/reports/statisticsServices'
  import BackupServices from './services/backUp/backupServices'


  import {
    uploadFileToS3,
    checkFileExistenceInS3,
    listFilesInS3Bucket,
    downloadFileFromS3
  } from './middleware/upload'

  import sanitize from 'sanitize-filename'

  // Load .env values ASAP
  dotenv.config()

  // Promisified DNS lookup for connectivity checks
  const dnsLookup = util.promisify(dns.lookup)

  /**
   * Utility type that narrows model names that actually exist on the PrismaClient.
   * If you maintain a lot of dynamic model access, keep this list in sync or replace
   * with (keyof PrismaClient & string) if you prefer a looser type.
   */
  export type ModelName =
    | 'role'
    | 'user'
    | 'category'
    | 'governorate'
    | 'directorate'
    | 'pharmacy'
    | 'square'
    | 'disease'
    | 'applicant'
    | 'accredited'
    | 'diseasesApplicants'
    | 'prescription'
    | 'attachment'
    | 'dismissal'
    | 'syncStatus'

  /**
   * Central database layer that instantiates two Prisma clients (local & cloud)
   * and exposes domain services that automatically point at the correct client.
   */
  class DatabaseService {
    private localPrisma: PrismaClient
    private cloudPrisma: PrismaClient

    /** Domain services (lazily populated) */
    private authService?: AuthService
    private governorateService?: GovernorateService
    private directorateService?: DirectorateService
    private categoryService?: CategoryService
    private applicantService?: ApplicantService
    private squareServices?: SquareServices
    private pharmacyService?: PharmacyService
    private dismissalServices?: DismissalServices
    private accreditedServices?: AccreditedServices
    private diseasesApplicantsServices?: DiseasesApplicantsServices
    private diseaseServices?: DiseaseServices
    private roleServices?: RoleServices
    private prescriptionService?: PrescriptionService
    private attachmentServiceService?: AttachmentServiceService
    private statisticsServices?: StatisticsServices
    private backupServices?: BackupServices

    constructor() {
      // ---------------- Local & cloud clients ----------------
      try {
        // Always use PostgreSQL for local database
        const localDbUrl = process.env.DATABASE_URL || 'postgresql://postgres:123@localhost:5432/hdf-production?schema=public';
        
        console.log('Initializing local PostgreSQL database with URL:', localDbUrl);
        
        this.localPrisma = new PrismaClient({
          datasources: {
            db: {
              url: localDbUrl
            }
          },
          errorFormat: 'pretty',
          log: ['error', 'warn']
        });
        
        console.log('Local PostgreSQL client initialized successfully');
        
        // Initialize cloud client if URL is provided
        if (process.env.CLOUD_DATABASE_URL) {
          console.log('Initializing cloud database connection');
          this.cloudPrisma = new PrismaClient({
            datasources: {
              db: {
                url: process.env.CLOUD_DATABASE_URL
              }
            },
            errorFormat: 'pretty',
            log: ['error', 'warn']
          });
          console.log('Cloud Prisma client initialized successfully');
        } else {
          console.log('No CLOUD_DATABASE_URL provided, using hardcoded fallback for cloud client');
          this.cloudPrisma = new PrismaClient({
            datasources: {
              db: {
                url: 'postgresql://postgres:123456789@15.207.99.228:5432/hdf?schema=public'
              }
            },
            errorFormat: 'pretty',
            log: ['error', 'warn']
          });
        }
        
        // Immediately build service layer
        this.initializeServices().catch(err => {
          console.error('Failed to initialize services:', err);
        });
      } catch (error) {
        console.error('Failed to initialize database clients:', error);
        throw new Error('Database connection failed. Please ensure PostgreSQL is running and correctly configured.');
      }
    }

    /** True if an outbound lookup to google.com resolves */
    private async isOnline(): Promise<boolean> {
      try {
        await dnsLookup('google.com')
        return true
      } catch {
        return false
      }
    }

    /** Currently we always return the *local* client. If you decide to switch
     * automatically depending on connectivity, change logic here.
     */
    async getPrismaClient(): Promise<PrismaClient> {
      return this.localPrisma
    }

    /** Instantiate each domain service with whichever Prisma client we want */
    private async initializeServices(): Promise<void> {
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
      this.prescriptionService = new PrescriptionService(prisma)
      this.attachmentServiceService = new AttachmentServiceService(prisma)
      this.statisticsServices = new StatisticsServices(prisma)
      this.backupServices = new BackupServices(prisma)
    }

    // ------------------------- Service Getters -------------------------
    // Each getter throws if called before initializeServices() finishes, which
    // protects against accidental null-access at runtime.

    getAuthService(): AuthService {
      if (!this.authService) throw new Error('AuthService not initialized')
      return this.authService
    }
    getGovernorateService(): GovernorateService {
      if (!this.governorateService) throw new Error('GovernorateService not initialized')
      return this.governorateService
    }
    getDirectorateService(): DirectorateService {
      if (!this.directorateService) throw new Error('DirectorateService not initialized')
      return this.directorateService
    }
    getCategoryService(): CategoryService {
      if (!this.categoryService) throw new Error('CategoryService not initialized')
      return this.categoryService
    }
    getApplicantService(): ApplicantService {
      if (!this.applicantService) throw new Error('ApplicantService not initialized')
      return this.applicantService
    }
    getSquareService(): SquareServices {
      if (!this.squareServices) throw new Error('SquareServices not initialized')
      return this.squareServices
    }
    getPharmacyService(): PharmacyService {
      if (!this.pharmacyService) throw new Error('PharmacyService not initialized')
      return this.pharmacyService
    }
    getDismissalService(): DismissalServices {
      if (!this.dismissalServices) throw new Error('DismissalServices not initialized')
      return this.dismissalServices
    }
    getAccreditedService(): AccreditedServices {
      if (!this.accreditedServices) throw new Error('AccreditedServices not initialized')
      return this.accreditedServices
    }
    getDiseasesApplicantsService(): DiseasesApplicantsServices {
      if (!this.diseasesApplicantsServices)
        throw new Error('DiseasesApplicantsServices not initialized')
      return this.diseasesApplicantsServices
    }
    getDiseaseService(): DiseaseServices {
      if (!this.diseaseServices) throw new Error('DiseaseServices not initialized')
      return this.diseaseServices
    }
    getRoleService(): RoleServices {
      if (!this.roleServices) throw new Error('RoleServices not initialized')
      return this.roleServices
    }
    getPrescriptionService(): PrescriptionService {
      if (!this.prescriptionService) throw new Error('PrescriptionService not initialized')
      return this.prescriptionService
    }
    getAttachmentService(): AttachmentServiceService {
      if (!this.attachmentServiceService)
        throw new Error('AttachmentServiceService not initialized')
      return this.attachmentServiceService
    }
    getStatisticsServices(): StatisticsServices {
      if (!this.statisticsServices) throw new Error('StatisticsServices not initialized')
      return this.statisticsServices
    }
    getBackupServices(): BackupServices {
      if (!this.backupServices) throw new Error('BackupServices not initialized')
      return this.backupServices
    }

    // ------------------------- Seeding helpers -------------------------

    /**
     * Seed default roles & users if they do not already exist in the local DB.
     * Call once on app start if needed.
     */
    async seedUsersAndRoles(): Promise<void> {
      try {
        const prisma = await this.getPrismaClient();

        const roles = ['Admin', 'Coordinator', 'Pharmacist'] as const;
        const users: Array<{ email: string; role: typeof roles[number]; name: string }> = [
          { email: 'admin@hdfye.org', role: 'Admin', name: 'المدير' },
          { email: 'coordinator@hdfye.org', role: 'Coordinator', name: 'المنسق' },
          { email: 'pharmacist@hdfye.org', role: 'Pharmacist', name: 'الصيدلاني' },
        ];

        for (const roleName of roles) {
          const existingRole = await prisma.role.findFirst({ where: { name: roleName } });
          if (!existingRole) {
            const globalId = `${process.env.LOCAL_DB_ID}-${roleName}`;
            await prisma.role.create({ data: { name: roleName, globalId } });
          }
        }

        for (const { email, role, name } of users) {
          const roleRow = await prisma.role.findFirst({ where: { name: role } });
          if (!roleRow) continue;

          const password = await bcrypt.hash(`${role}!@#123`, 10);
          const timestamp = Date.now();
          const uniqueId = uuidv4();
          const globalId = `${process.env.LOCAL_DB_ID}-${role}-${uniqueId}-${timestamp}`;

          await prisma.user.upsert({
            where: { email },
            update: {
              name,
              password,
              roleGlobalId: roleRow.globalId,
              deleted: false,
              lastModified: new Date(),
            },
            create: {
              name,
              email,
              password,
              roleGlobalId: roleRow.globalId,
              globalId,
              deleted: false,
              lastModified: new Date(),
            },
          });
        }
      } catch (err) {
        console.error('Failed to seed roles/users:', err);
      }
    }

    // ------------------------- Sync helpers -------------------------

    /**
     * Push local changes for a single model to the cloud DB.
     * Returns `true` if at least one record was processed.
     */
    async synchronizeTable(modelName: ModelName): Promise<boolean> {
    const online = await this.isOnline();
    if (!online) return false;

    try {
      const syncStatus = await this.localPrisma.syncStatus.findUnique({ where: { modelName } });
      const lastSyncedAt = syncStatus?.lastSyncedAt ?? new Date(0);

      const localRecords = (this.localPrisma as any)[modelName].findMany({
        where: {
          OR: [
            { createdAt: { gt: lastSyncedAt } },
            { lastModified: { gt: lastSyncedAt } },
          ],
        },
      }) as Promise<Array<Record<string, any>>>;

      const records = await localRecords;
      if (records.length === 0) return false;

      const batchSize = 20;
      let processed = false;
      let count = 0;

      console.log(`🔁 Starting sync for ${records.length} records in table "${modelName}"...`);

      for (let i = 0; i < records.length; i += batchSize) {
        const batch = records.slice(i, i + batchSize);

        await Promise.all(
          batch.map(async (record: Record<string, any>) => {
            count++;
            try {
              await this.cloudPrisma.$transaction(async (tx: any) => {
                const { id, ...dataForSync } = record;

                if (modelName === 'user') {
                  await tx.user.upsert({
                    where: { globalId: record.globalId }, // ✅ يستخدم globalId بدل email
                    update: {
                      ...dataForSync,
                      lastModified: new Date(),
                    },
                    create: {
                      ...dataForSync,
                      lastModified: new Date(),
                    },
                  });
                } else {
                  const existing = await tx[modelName].findUnique({
                    where: { globalId: record.globalId },
                  });

                  if (!existing) {
                    await tx[modelName].create({
                      data: { ...dataForSync, globalId: record.globalId },
                    });
                  } else if (existing.lastModified < record.lastModified) {
                    await tx[modelName].update({
                      where: { globalId: existing.globalId },
                      data: { ...dataForSync, lastModified: new Date() },
                    });
                  }
                }

                // console.log(`✅ Synced ${modelName} ${count} of ${records.length} (globalId=${record.globalId})`);
                processed = true;
              }, { maxWait: 10000, timeout: 60000 });
            } catch (err:any) {
              console.error(`❌ Failed to sync ${modelName} globalId=${record.globalId}:`, err.message);
            }
          })
        );
      }

      return processed;
    } catch (err) {
      console.error(`❌ Sync of ${modelName} failed:`, err);
      throw err;
    }
    }

    /**
     * Pull newer rows from cloud into local DB for a single model.
     * Returns `true` if at least one update was applied.
     */
    async fetchUpdatesFromServer(modelName: ModelName): Promise<boolean> {
      const online = await this.isOnline()
      if (!online) {
        // console.log(`⏭ Skipping fetch for ${modelName}: offline.`)
        return false
      }
    
      try {
        const syncStatus = await this.localPrisma.syncStatus.findUnique({
          where: { modelName }
        })
        const lastSyncedAt = syncStatus?.lastSyncedAt ?? new Date(0)
    
        const cloudModel = (this.cloudPrisma as any)[modelName]
        const localModel = (this.localPrisma as any)[modelName]
    
        const rows = await cloudModel.findMany({
          where: {
            OR: [
              { createdAt: { gt: lastSyncedAt } },
              { lastModified: { gt: lastSyncedAt } }
            ]
          }
        })
    
        if (!rows.length) {
          // console.log(`📭 No updates for ${modelName}`)
          return false
        }
    
        let applied = false
    
        for (const row of rows) {
          try {
            const { id, ...data } = row
            const existing = await localModel.findUnique({
              where: { globalId: row.globalId }
            })
    
            if (!existing) {
              await localModel.create({
                data: { ...data, globalId: row.globalId }
              })
              console.log(`✅ Created ${modelName} ${row.globalId}`)
              applied = true
            } else if ((existing.version ?? 0) < row.version) {
              await localModel.update({
                where: { globalId: row.globalId },
                data
              })
              // console.log(`🔄 Updated ${modelName} ${row.globalId}`)
              applied = true
            } else {
              // console.log(`⏩ Skipped ${modelName} ${row.globalId}: already up to date.`)
            }
          } catch (innerErr: any) {
            console.warn(`⚠️ Skipped ${modelName} ${row.globalId} due to error:`, innerErr.message)
            console.log('⚠️ Problematic row object:', JSON.stringify(row, null, 2))
            continue
          }
        }
    
        return applied
      } catch (err) {
        console.error(`❌ Fetch updates failed for ${modelName}:`, err)
        return false
      }
    }
    

    /** Update the sync checkpoint for a model with fallback to local time */
    async updateLastSyncedAt(modelName: ModelName): Promise<void> {
      try {
        let syncTime: Date;
        
        // Try to get time from timeapi.io
        try {
          const { data } = await axios.get<{ dateTime: string }>(
            'https://timeapi.io/api/Time/current/zone?timeZone=Asia/Riyadh',
            { timeout: 3000 } // Add timeout to prevent hanging
          );
          syncTime = new Date(data.dateTime);
          console.log(`Got time from timeapi.io: ${syncTime.toISOString()}`);
        } catch (timeApiError) {
          // Fallback to local time if timeapi.io is unavailable
          console.warn('Failed to get time from timeapi.io, using local time:', timeApiError);
          syncTime = new Date();
        }
        
        await this.localPrisma.syncStatus.upsert({
          where: { modelName },
          update: { lastSyncedAt: syncTime },
          create: { modelName, lastSyncedAt: syncTime }
        });
        console.log(`Updated lastSyncedAt for ${modelName} to ${syncTime.toISOString()}`);
      } catch (err) {
        console.error(`Failed to update lastSyncedAt for ${modelName}:`, err);
      }
    }

    // ------------------------- File sync helpers -------------------------

    async synchronizeS3ToLocal(): Promise<void> {
      try {
        const prisma = await this.getPrismaClient()
        const profileDir = 'D://Profiles' // ensure this exists

  const s3Files = await listFilesInS3Bucket('hdf-dev') ?? [];

        await Promise.all(
          s3Files.map(async (file) => {
            try {
              const sanitized = sanitize(file.Key ?? '')
              const localPath = path.join(profileDir, sanitized)

              const attachmentExists = await prisma.attachment.findFirst({
                where: { attachmentFile: `D://Profiles//${file.Key}` }
              })
              const prescriptionExists = await prisma.prescription.findFirst({
                where: { attachedUrl: `D://Profiles//${file.Key}` }
              })

              if (attachmentExists || prescriptionExists) {
                if (file.Key) {
                  await downloadFileFromS3('hdf-dev', file.Key, localPath)
                } else {
                  console.warn('Skipping file with undefined Key');
                }
                console.log(`Downloaded ${file.Key}`)
              }
            } catch (inner) {
              console.error(`Download failed ${file.Key}:`, inner)
            }
          })
        )
      } catch (err) {
        console.error('synchronizeS3ToLocal failed:', err)
      }
    }

async synchronizeLocalToS3(): Promise<void> {
  try {
    console.log("&*&*&*&*&*&&&&&&&&&&*&*&*&*&*&*&*&*&*&*&*&*&*&&*")
    const prisma = await this.getPrismaClient(); // 🟢 تأكد أنه متصل بـ cloud DB
    const profileDir = 'D://Profiles'
    const files = await fs.readdir(profileDir)
    console.log("h")
    console.log('📁 الملفات الموجودة في D://Profiles:', files);

    if (files.length === 0) {
      console.warn('⚠️ لا توجد ملفات في المجلد، تأكد أن المجلد صحيح ويحتوي على ملفات');
      return;
    }
    await Promise.all(
      files.map(async (file) => {
        try {

          const filePath = path.join(profileDir, file);
          
          const fileBuffer = await fs.readFile(filePath);

          


          // const existsInS3 = await checkFileExistenceInS3('hdf-dev', `accredited/atch/${file}`)
          //   || await checkFileExistenceInS3('hdf-dev', `accredited/pt/${file}`);
          //   console.log("###############################################")
          // if (existsInS3) return;

          const attachmentRecord = await prisma.attachment.findFirst({
            where: { attachmentFile: `D:\\Profiles/${file}` } // من الداتا بيز الكلاود
          });
          const prescriptionRecord = await prisma.prescription.findFirst({
            where: { attachedUrl: `D:\\Profiles/${file}` }
          });
          if (attachmentRecord || prescriptionRecord) {

            // 🟢 نحدد نوع المسار الجديد
            let s3Key = '';
            if (attachmentRecord) {
              s3Key = `accredited/atch/${file}`;
              await prisma.attachment.update({
                where: { id: attachmentRecord.id },
                data: { attachmentFile: s3Key }
              });
            }
            if (prescriptionRecord) {
              s3Key = `accredited/pt/${file}`;
              await prisma.prescription.update({
                where: { id: prescriptionRecord.id },
                data: { attachedUrl: s3Key }
              });
            }

            await uploadFileToS3('hdf-dev', s3Key, fileBuffer, 'application/octet-stream');
            console.log(`✅ Uploaded and updated DB for: ${file}`);
          }
        } catch (inner) {
          console.error(`❌ Upload failed for ${file}:`, inner);
        }
      })
    );
  } catch (err) {
    console.error('❌ synchronizeLocalToS3 failed:', err);
  }
}

  async user() {
    return this.seedUsersAndRoles();
  }

  async switchDatabaseBasedOnConnectivity() {
    console.log('Starting database connectivity check...');
    
    try {
      // Test PostgreSQL connection
      await this.localPrisma.$connect();
      console.log('PostgreSQL connection successful');
      
      // Initialize services
      await this.initializeServices();
      console.log('Database connectivity check completed successfully');
      return true;
    } catch (error) {
      console.error('PostgreSQL connection failed:', error);
      throw new Error('Failed to connect to PostgreSQL database. Please ensure the database is running and properly configured.');
    }
  }
    /** Return true if any model has new rows pending sync (local⇆cloud). */
    async hasPendingSyncData(): Promise<boolean> {
      const tables: ModelName[] = [
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
        const syncStatus = await this.localPrisma.syncStatus.findUnique({ where: { modelName: table } })
        const lastSyncedAt = syncStatus?.lastSyncedAt ?? new Date(0)

        const countLocal = await (this.localPrisma as any)[table].count({
          where: {
            OR: [{ createdAt: { gt: lastSyncedAt } }, { lastModified: { gt: lastSyncedAt } }]
          }
        })
        const countCloud = await (this.cloudPrisma as any)[table].count({
          where: {
            OR: [{ createdAt: { gt: lastSyncedAt } }, { lastModified: { gt: lastSyncedAt } }]
          }
        })
        if (countLocal > 0 || countCloud > 0) return true
      }
      return false
    }
  }

  /**
   * Singleton instance to be imported across the application.
   * You can also `export default new DatabaseService();` if you prefer.
   */
  export const databaseService = new DatabaseService()
