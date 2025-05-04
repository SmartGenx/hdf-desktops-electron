class AccreditedByPrescription {
  constructor(Applicant, formNumber, DiseaseName, Namedirectorate, prescription, days, Months) {
    this.name = Applicant.name;
    this.formNumber = formNumber;
    this.disease = DiseaseName;
    this.directorate = Namedirectorate;
    this.phoneNumber = Applicant.phoneNumber;
    this.latestPrescriptionDate = prescription.latestPrescriptionDate;
    this.renewalDate = prescription.renewalDate;
    this.days = days;
    this.months = Months;
    this.state = Applicant.state;
  }
}

module.exports = AccreditedByPrescription;