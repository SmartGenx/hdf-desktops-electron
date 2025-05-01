import { Icons } from '@renderer/components/icons/icons'

export type NavItem = {
  title?: string
  list: Array<{
    type?: 'link' | 'group'
    href: string
    disabled?: boolean
    external?: boolean
    icon?: keyof typeof Icons
    label: string
    description?: string
    roles?: string[]
    subLinks?: { href: string; label: string; disabled?: boolean }[]
  }>
}
export type Dismissales = {
  info: DismissalInfo[]
  total: number
  page: string
  pageSize: string
}
export type ApplicantByDirectorateViewModelInfo = {
  name: string
  gender: string
  disease: string
  directorate: string
  phoneNumber: string
  state: string
  totalAmount: number
  supportRatio: string
  formNumber: number
  approvedAmount: number
  Months :string
  year :string
}
export type PrintApplication = {
  name: string
  gender: string
  disease: string
  directorate: string
  phoneNumber: string
  state: string
  totalAmount: number
  supportRatio: string
  approvedAmount: number
}
export type ApplicantByDirectorateViewModel = {
  info: ApplicantByDirectorateViewModelInfo[]
  total: number
  page: string
  pageSize: string
}
export type AllAccreditedsForPdfInfo = {
  name: string
  disease: string
  directorate: string
  phoneNumber: string
  orescriptionDate: Date
  renewalDate: Date
  formNumber: number
  days: number
  Months: number
  state: string
}
export type AllAccreditedsForPdf = {
  info: AllAccreditedsForPdfInfo[]
  total: number
  page: string
  pageSize: string
}

export type applicantsReportCategory = {
  name: string
  disease: string
  directorate: string
  phoneNumber: string
  submissionDate: Date
  category: string
}
export type Print = {
  name: string
  disease: string
  directorate: string
  phoneNumber: string
  submissionDate: Date
  category: string
}
export type PrintFollowing = {
  name: string
  disease: string
  directorate: string
  phoneNumber: string
  orescriptionDate: Date
  renewalDate: Date
  days: number
  Months: number
  state: string
}
export type applicantsReportCategoryInfo = {
  info: applicantsReportCategory[]
  total: number
  page: string
  pageSize: string
}
export type DismissalInfo = {
  id: number
  globalId: string
  month: string
  year: string
  dateToDay: Date
  state: string
  totalAmount: number
  amountPaid: number
  approvedAmount: number
  openDismissal: boolean
  deleted: boolean
  accreditedGlobalId: string
  version: number
  lastModified: Date
  Accredited?: AccreditedInfo
}

export type Square = {
  id: number
  globalId: string
  name: string
  deleted: boolean
  version: number
  lastModified: Date
}
export type applicantType = {
  id: number
  globalId: string
  name: string
  age: number
  dateOfBirth: Date
  placeOfBirth: string
  currentResidence: string
  gender: string
  directorateGlobalId: string
  phoneNumber: string
  submissionDate: Date
  deleted: boolean
  accredited: boolean
  categoryGlobalId: string
  state: string
  version: number
  lastModified: Date
}

export type Accrediteds = {
  info: AccreditedInfo[]
  total: number
  page: string
  pageSize: string
}
export type Applicants = {
  info: ApplicantsInfo[]
  total: number
  page: string
  pageSize: string
}

export type AccreditedInfo = {
  id: number
  globalId?: string
  squareGlobalId: string
  treatmentSite: string
  doctor: string
  state: string
  numberOfRfid: number
  formNumber: number
  deleted?: boolean
  applicantGlobalId: string
  pharmacyGlobalId: string
  version?: number
  lastModified?: Date
  applicant?: ApplicantsInfo
  square?: Square
  pharmacy?: Pharmacy
}
export type Pharmacy = {
  globalId: string
  name: string
  location: string
  startDispenseDate: number
  endispenseDate: number
  governorateGlobalId: string
}

export type ApplicantsInfo = {
  id: number
  globalId: string
  name: string
  age: number
  dateOfBirth: Date
  placeOfBirth: string
  currentResidence: string
  gender: string
  directorateGlobalId: string
  phoneNumber: string
  submissionDate: Date
  deleted: boolean
  accredited: boolean
  categoryGlobalId: string
  state: string
  version: number
  lastModified: Date
  directorate?: Directorate
  category: Category
  diseasesApplicants?: DiseasesApplicant[]
}
export type ApplicantsInfoResp = {
  id: number
  globalId: string
  name: string
  age: number
  dateOfBirth: Date
  placeOfBirth: string
  currentResidence: string
  gender: string
  directorateGlobalId: string
  phoneNumber: string
  submissionDate: Date
  deleted: boolean
  accredited: boolean
  categoryGlobalId: string
  state: string
  version: number
  lastModified: Date
  diseasesApplicants: DiseasesApplicantInfo[]
}
export interface DiseasesApplicantInfo {
  id: number
  globalId: string
  diseaseGlobalId: string
  deleted: boolean
  applicantGlobalId: string
  version: number
  lastModified: Date
}
export interface DiseasesResponses {
  id: number
  globalId: string
  name: string
  deleted: boolean
  description: string
  version: number
  lastModified: Date
}
export type Category = {
  id: number
  globalId: string
  name: string
  SupportRatio?: number
  deleted: boolean
  description?: string
  version: number
  lastModified: Date
  governorateGlobalId?: string
}

export type Directorate = {
  id: number
  globalId: string
  governorateGlobalId: string
  name: string
  deleted: boolean
  version: number
  lastModified: Date
}

export type DiseasesApplicant = {
  id: number
  name: string
  globalId: string
  description: string
  diseaseGlobalId: string
  deleted: boolean
  applicantGlobalId: string
  version: number
  lastModified: Date
}

export type loginType = {
  email: string
  password: string
}
export interface statisticCardType {
  diseaseCount: number
  GovernorateCount: number
  directoratecount: number
  squareCount: number
}

export type typeRespons = {
  token: string
  user: User
}
export type User = {
  name: string
  email: string
  profileImage: string
  role: string
}

export interface AccreditedInfos {
  id: number
  globalId: string
  squareGlobalId: string
  treatmentSite: string
  doctor: string
  state: string
  numberOfRfid: number
  formNumber: number
  deleted: boolean
  applicantGlobalId: string
  pharmacyGlobalId: string
  version: number
  lastModified: Date
  prescription: Prescription[]
}
export interface AccreditedInfosRes {
  id: number
  globalId: string
  squareGlobalId: string
  treatmentSite: string
  doctor: string
  state: string
  numberOfRfid: number
  formNumber: number
  deleted: boolean
  applicantGlobalId: string
  pharmacyGlobalId: string
  version: number
  lastModified: Date
  prescription: Prescription[]
  applicant: ApplicantsInfo
  attachment: Attachment[]
}
export interface Attachment {
  id: number
  globalId: string
  attachmentFile: string
  type: string
  deleted: boolean
  accreditedGlobalId: string
  version: number
  lastModified: Date
}
export interface Prescription {
  id: number
  globalId: string
  prescriptionDate: Date
  renewalDate: Date
  attachedUrl: string
  deleted: boolean
  accreditedGlobalId: string
  version: number
  lastModified: Date
}
export interface Accredited {
  info: AccreditedInfos[]
  total: number
  page: string
  pageSize: string
}
export interface AccreditedRes {
  info: AccreditedInfosRes[]
  total: number
  page: string
  pageSize: string
}
export interface user {
  email: string
  name: string
  profileImage: null
  role: string
}
export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[]
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[]
}

export interface FooterItem {
  title: string
  items: {
    title: string
    href: string
    external?: boolean
  }[]
}

export type MainNavItem = NavItemWithOptionalChildren

export type SidebarNavItem = NavItemWithChildren
export type Governorate = {
  id: number
  globalId: string
  name: string
  deleted: boolean
  version: number
  // Directorate: Directorate[];
  // Pharmacy: Pharmacy[];
  lastModified: Date
}
