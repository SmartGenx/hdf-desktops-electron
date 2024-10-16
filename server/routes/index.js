const express = require('express')
const { authRouter } = require('./auth')
const { governorateRouter } = require('./governorateRoutes')
const { directorateRouter } = require('./directorateRoutes')
const { categoryRouter } = require('./categoryRoutes')
const { applicantRouter } = require('./applicantRoutes')
const { squareRouter } = require('./squareRoutes')
const { pharmacyRouter } = require('./pharmacyRoutes')
const { accreditedRouter } = require('./accreditedRoutes')
const { dismissalRouter } = require('./dismissalRoutes')
const { diseasesApplicantsRouter } = require('./diseasesApplicantsRoutes')
const { diseaseRouter } = require('./diseaseRoutes')
const { prescriptionRouter } = require('./prescriptionRoutes')
const { roleRouter } = require('./roleRoutes')
const { attachmentRouter } = require('./attachmentRoutes')
const { statisticsRouter } = require('./statisticsRoutes')
const { backUpRouter } = require('./backUpRoutes')

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

module.exports = { rootRouter } // Export the root router directly
