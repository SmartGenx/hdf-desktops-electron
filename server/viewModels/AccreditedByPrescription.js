class AccreditedByPrescription {
  constructor(Applicant,DiseaseName,Namedirectorate,prescription, days,Months) {
    this.name = Applicant.name;
    this.disease = DiseaseName;
    this.directorate = Namedirectorate;
     this.phoneNumber = Applicant.phoneNumber;
     this.orescriptionDate = prescription.latestPrescriptionDate;
     this.renewalDate = prescription.renewalDate;
     this.days = days;
     this.Months = Months;
     this.state=Applicant.state
  


  }
}
// , DiseaseName, state, Dismissal,Namedirectorate
module.exports = AccreditedByPrescription;