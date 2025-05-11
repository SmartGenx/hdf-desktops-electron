interface Applicant {
  name: string;
  phoneNumber: string;
  submissionDate: Date;
}

export class ApplicantByCategoryViewModel {
  name: string;
  disease: string;
  directorate: string;
  phoneNumber: string;
  submissionDate: Date;
  category: string;

  constructor(
    Applicant: Applicant,
    DiseaseName: string,
    Namedirectorate: string,
    categoryName: string
  ) {
    this.name = Applicant.name;
    this.disease = DiseaseName;
    this.directorate = Namedirectorate;
    this.phoneNumber = Applicant.phoneNumber;
    this.submissionDate = Applicant.submissionDate;
    this.category = categoryName;
  }
}
