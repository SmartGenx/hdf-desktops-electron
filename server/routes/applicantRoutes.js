const Router = require("express");
const applicantRouter = Router();
const ApplicantController = require("../controllers/applicantControllers"); // Ensure you have an ApplicantController

// Create a new applicant
applicantRouter.post('/', ApplicantController.createApplicant);

// Update an existing applicant
applicantRouter.put('/:id', ApplicantController.updateApplicant);
applicantRouter.put('/ApplicantAccredited/:id', ApplicantController.updateApplicantAccredited);

// Get all applicants
applicantRouter.get('/', ApplicantController.getAllOrSearchApplicants);
applicantRouter.get('/update', ApplicantController.getAllApplicantsUseUpdate);

applicantRouter.get('/ApplicantByDirectorateViewModel', ApplicantController.getAllAccreditedAfterDismissal);
applicantRouter.get('/applicantsReportCategory', ApplicantController.ApplicantReportCategory);
applicantRouter.get('/count', ApplicantController.countAllApplicants);
applicantRouter.get('/ApplicantMonthlyGenderCount', ApplicantController.getApplicantMonthlyGenderCounts);
// Get an applicant by ID
applicantRouter.get('/:id', ApplicantController.getApplicantById);

// Delete an applicant by ID
applicantRouter.delete('/:id', ApplicantController.deleteApplicant);

module.exports = { applicantRouter }; // Export the router directly with the correct case
