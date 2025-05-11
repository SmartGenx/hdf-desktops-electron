interface Applicant {
  name: string;
  gender: string;
  phoneNumber: string;
}

interface Dismissal {
  totalAmount: number;
  approvedAmount: number;
}

export class ApplicantByDirectorateViewModel {
  name: string;
  gender: string;
  disease: string;
  directorate: string;
  phoneNumber: string;
  state: string;
  totalAmount: number;
  supportRatio: string;
  approvedAmount: number;
  Months: string;
  year: number;

  constructor(
    Applicant: Applicant,
    DiseaseName: string,
    Namedirectorate: string,
    state: string,
    dismissals: Dismissal,
    Namecategory: string,
    Month: string,
    year: number
  ) {
    this.name = Applicant.name;
    this.gender = Applicant.gender;
    this.disease = DiseaseName;
    this.directorate = Namedirectorate;
    this.phoneNumber = Applicant.phoneNumber;
    this.state = state;
    this.totalAmount = dismissals?.totalAmount ?? 0;
    this.supportRatio = Namecategory;
    this.approvedAmount = dismissals?.approvedAmount ?? 0;
    this.Months = Month;
    this.year = year;
  }
}
