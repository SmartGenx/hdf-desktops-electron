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
    subLinks?: { href: string; label: string; disabled?: boolean }[]
  }>
}

export type Square = {
  id:           number;
  globalId:     string;
  name:         string;
  deleted:      boolean;
  version:      number;
  lastModified: Date;
}
export type Accrediteds = {
  info:     AccreditedInfo[];
  total:    number;
  page:     string;
  pageSize: string;
}
export type Applicants = {
  info: ApplicantsInfo[]
  total: number
  page: string
  pageSize: string
}
export type AccreditedInfo = {
  id:                number;
  globalId?:          string;
  squareGlobalId:    string;
  treatmentSite:     string;
  doctor:            string;
  state:             string;
  numberOfRfid:      number;
  formNumber:        number;
  deleted?:           boolean;
  applicantGlobalId: string;
  pharmacyGlobalId:  string;
  version?:           number;
  lastModified?:      Date;
  applicant?:         ApplicantsInfo;
  square?:            Square;
  pharmacy?:Pharmacy
}
export type Pharmacy = {
  globalId:            string;
  name:                string;
  location:            string;
  startDispenseDate:   number;
  endispenseDate:      number;
  governorateGlobalId: string;
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
  globalId: string
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
type User = {
  name: string
  email: string
  profileImage: string
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
