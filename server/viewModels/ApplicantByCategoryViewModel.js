class ApplicantByCategoryViewModel  {
  constructor(Applicant,DiseaseName,Namedirectorate,categoryName) {
    this.name = Applicant.name;
    this.disease = DiseaseName;
    this.directorate = Namedirectorate;
     this.phoneNumber = Applicant.phoneNumber;
     this.submissionDate = Applicant.submissionDate;  
     this.category =categoryName;  

  }
}
// , DiseaseName, state, Dismissal,Namedirectorate
module.exports = ApplicantByCategoryViewModel ;