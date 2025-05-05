const express = require('express')
const { authRouter } = require('./user/auth')
const { governorateRouter } = require('./systemSetting/governorateRoutes')
const { directorateRouter } = require('./systemSetting/directorateRoutes')
const { categoryRouter } = require('./systemSetting/categoryRoutes')
const { applicantRouter } = require('./applicant/applicantRoutes')
const { squareRouter } = require('./systemSetting/squareRoutes')
const { pharmacyRouter } = require('./systemSetting/pharmacyRoutes')
const { accreditedRouter } = require('./accreditation/accreditedRoutes')
const { dismissalRouter } = require('./dismissal/dismissalRoutes')
const { diseasesApplicantsRouter } = require('./applicant/diseasesApplicants/diseasesApplicantsRoutes')
const { diseaseRouter } = require('./systemSetting/diseaseRoutes')
const { prescriptionRouter } = require('./accreditation/prescriptionRoutes')
const { roleRouter } = require('./user/roleRoutes')
const { attachmentRouter } = require('./attachment/attachmentRoutes')
const { statisticsRouter } = require('./reports/statisticsRoutes')
const { backUpRouter } = require('./backUp/backUpRoutes')
const {syncProcessRouter} = require('../routes/systemSetting/syncProcessRoutes')
const  whatsappRouter  = require('./message/whatsappRoutes');

const rootRouter = express.Router()

rootRouter.use('/auth', authRouter) //done
rootRouter.use('/governorate', governorateRouter) //done
rootRouter.use('/directorate', directorateRouter) //done
rootRouter.use('/category', categoryRouter) //done
rootRouter.use('/applicant', applicantRouter) //done
rootRouter.use('/square', squareRouter) //done
rootRouter.use('/pharmacy', pharmacyRouter) //done
rootRouter.use('/accredited', accreditedRouter) //done
rootRouter.use('/dismissal', dismissalRouter) //done
rootRouter.use('/diseasesApplicants', diseasesApplicantsRouter)
rootRouter.use('/disease', diseaseRouter) //done
rootRouter.use('/prescription', prescriptionRouter) //
rootRouter.use('/attachment', attachmentRouter)
rootRouter.use('/role', roleRouter)
rootRouter.use('/statistics', statisticsRouter)
rootRouter.use('/backUp', backUpRouter)
rootRouter.use('/syncProcess', syncProcessRouter)
rootRouter.use('/wahtsApp', whatsappRouter);

module.exports = { rootRouter } // Export the root router directly
