import express, { Router } from 'express';
import { authRouter } from './user/auth';
import { governorateRouter } from './systemSetting/governorateRoutes';
import { directorateRouter } from './systemSetting/directorateRoutes';
import { categoryRouter } from './systemSetting/categoryRoutes';
import { applicantRouter } from './applicant/applicantRoutes';
import { squareRouter } from './systemSetting/squareRoutes';
import { pharmacyRouter } from './systemSetting/pharmacyRoutes';
import { accreditedRouter } from './accreditation/accreditedRoutes';
import { dismissalRouter } from './dismissal/dismissalRoutes';
import { diseasesApplicantsRouter } from './applicant/diseasesApplicants/diseasesApplicantsRoutes';
import { diseaseRouter } from './systemSetting/diseaseRoutes';
import { prescriptionRouter } from './accreditation/prescriptionRoutes';
import { roleRouter } from './user/roleRoutes';
import { attachmentRouter } from './attachment/attachmentRoutes';
import { statisticsRouter } from './reports/statisticsRoutes';
import { backUpRouter } from './backUp/backUpRoutes';
import { syncProcessRouter } from './systemSetting/syncProcessRoutes'; // ✅ عدلت المسار
import { whatsappRouter } from './message/whatsappRoutes'; // ✅ تأكد من الاسم الصحيح

const rootRouter: Router = express.Router();

rootRouter.use('/auth', authRouter);
rootRouter.use('/governorate', governorateRouter);
rootRouter.use('/directorate', directorateRouter);
rootRouter.use('/category', categoryRouter);
rootRouter.use('/applicant', applicantRouter);
rootRouter.use('/square', squareRouter);
rootRouter.use('/pharmacy', pharmacyRouter);
rootRouter.use('/accredited', accreditedRouter);
rootRouter.use('/dismissal', dismissalRouter);
rootRouter.use('/diseasesApplicants', diseasesApplicantsRouter);
rootRouter.use('/disease', diseaseRouter);
rootRouter.use('/prescription', prescriptionRouter);
rootRouter.use('/attachment', attachmentRouter);
rootRouter.use('/role', roleRouter);
rootRouter.use('/statistics', statisticsRouter);
rootRouter.use('/backUp', backUpRouter);
rootRouter.use('/syncProcess', syncProcessRouter);
rootRouter.use('/wahtsApp', whatsappRouter); // ✅ تأكد من تهجئة 'whatsapp'

export { rootRouter };
