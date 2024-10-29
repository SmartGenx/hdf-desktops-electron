class ApplicantByDirectorateViewModel {
  constructor(Applicant,DiseaseName,Namedirectorate,state,dismissals,Namecategory,Month) {
    this.name = Applicant.name;
    this.gender = Applicant.gender;
    this.disease = DiseaseName;
    this.directorate = Namedirectorate;
     this.phoneNumber = Applicant.phoneNumber;
     this.state = state;
    this.totalAmount = dismissals.totalAmount ; // Provide a default value if Dismissal is null
    this.supportRatio = Namecategory ; // Assuming supportRatio is a property you need
    this.approvedAmount = dismissals.approvedAmount ;
    this.Months = Month;


  }
}
// , DiseaseName, state, Dismissal,Namedirectorate
module.exports = ApplicantByDirectorateViewModel;
