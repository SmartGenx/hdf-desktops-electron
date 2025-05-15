interface Applicant {
  name: string;
  phoneNumber: string;
  state: string;
}

interface Prescription {
  latestPrescriptionDate: Date | null;
  renewalDate: Date | null;
}

export class AccreditedByPrescription {
  name: string;
  formNumber: string;
  disease: string;
  directorate: string;
  phoneNumber: string;
  latestPrescriptionDate: Date | null;
  renewalDate: Date | null;
  days: number;
  months: string;
  state: string;

  constructor(
    Applicant: Applicant,
    formNumber: string,
    DiseaseName: string,
    Namedirectorate: string,
    prescription: Prescription,
    days: number,
    Months: string
  ) {
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
