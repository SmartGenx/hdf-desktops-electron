import {
  AlertTriangle,
  ArrowRight,
  Baby,
  BarChartBig,
  Bell,
  Building,
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUser,
  CircuitBoardIcon,
  ClipboardList,
  Command,
  CopyCheck,
  CreditCard,
  DatabaseBackup,
  Factory,
  File,
  FileText,
  FilterXIcon,
  Fingerprint,
  Folder,
  HelpCircle,
  IdCard,
  Image,
  Laptop,
  LayoutDashboardIcon,
  LineChart,
  Loader2,
  LockKeyhole,
  LogIn,
  LogOut,
  LucideIcon,
  LucideProps,
  MonitorCheck,
  Moon,
  MoreVertical,
  Package,
  Pizza,
  Plus,
  Presentation,
  Settings,
  // SettingsIcon,

  // UserCogIcon,
  Settings2,
  ShieldHalf,
  ShoppingBag,
  SquareActivity,
  SquareKanban,
  SquareUser,
  SquareUserRound,
  SunMedium,
  Trash,
  Twitter,
  User,
  User2Icon,
  UserRoundCog,
  Users,
  UserX2Icon,
  X
} from 'lucide-react'
import DashboardNav from '../layouts/dashboard-nav'

export type Icon = LucideIcon

export const Icons = {
  family: Users,
  baby: Baby,
  woman: CircleUser,
  healthAndSafety: SquareActivity,
  statistics: BarChartBig,
  reports: LineChart,
  secretary: ShieldHalf,
  manageRelations: MonitorCheck,
  inseptionDepartment: FilterXIcon,
  localWorkers: SquareUser,
  foreignWorkers: SquareUserRound,
  offices: CopyCheck,

  // dashboard: LayoutDashboardIcon,
  localOrganizations: Building2,
  foreignOrganizations: Building,
  projects: SquareKanban,
  organizationSecretariat: Folder,
  logo: Command,
  login: LogIn,
  close: X,
  profile: User2Icon,
  spinner: Loader2,
  kanban: CircuitBoardIcon,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  trash: Trash,
  employee: UserX2Icon,
  post: FileText,
  page: File,
  media: Image,
  settings: Settings,
  billing: CreditCard,
  ellipsis: MoreVertical,
  add: Plus,
  warning: AlertTriangle,
  user: User,
  arrowRight: ArrowRight,
  help: HelpCircle,
  pizza: Pizza,
  sun: SunMedium,
  moon: Moon,
  laptop: Laptop,
  UserRoundCog: UserRoundCog,
  LockKeyhole: LockKeyhole,
  fingerPrint: Fingerprint,
  setting: Settings2,
  clipboardList: ClipboardList,
  factory: Factory,
  package: Package,
  shoppingBag: ShoppingBag,
  bell: Bell,
  presentation: Presentation,
  idCard: IdCard,
  databaseBackup: DatabaseBackup,
  dashboard: ({ ...props }: LucideProps) => (
    <svg
      width="20"
      height="21"
      viewBox="0 0 20 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.8125 3.69464H4.375C3.9606 3.69464 3.56317 3.85926 3.27015 4.15229C2.97712 4.44531 2.8125 4.84274 2.8125 5.25714V8.69464C2.8125 9.10904 2.97712 9.50647 3.27015 9.7995C3.56317 10.0925 3.9606 10.2571 4.375 10.2571H7.8125C8.2269 10.2571 8.62433 10.0925 8.91735 9.7995C9.21038 9.50647 9.375 9.10904 9.375 8.69464V5.25714C9.375 4.84274 9.21038 4.44531 8.91735 4.15229C8.62433 3.85926 8.2269 3.69464 7.8125 3.69464ZM7.5 8.38214H4.6875V5.56964H7.5V8.38214ZM15.625 3.69464H12.1875C11.7731 3.69464 11.3757 3.85926 11.0826 4.15229C10.7896 4.44531 10.625 4.84274 10.625 5.25714V8.69464C10.625 9.10904 10.7896 9.50647 11.0826 9.7995C11.3757 10.0925 11.7731 10.2571 12.1875 10.2571H15.625C16.0394 10.2571 16.4368 10.0925 16.7299 9.7995C17.0229 9.50647 17.1875 9.10904 17.1875 8.69464V5.25714C17.1875 4.84274 17.0229 4.44531 16.7299 4.15229C16.4368 3.85926 16.0394 3.69464 15.625 3.69464ZM15.3125 8.38214H12.5V5.56964H15.3125V8.38214ZM7.8125 11.5071H4.375C3.9606 11.5071 3.56317 11.6718 3.27015 11.9648C2.97712 12.2578 2.8125 12.6552 2.8125 13.0696V16.5071C2.8125 16.9215 2.97712 17.319 3.27015 17.612C3.56317 17.905 3.9606 18.0696 4.375 18.0696H7.8125C8.2269 18.0696 8.62433 17.905 8.91735 17.612C9.21038 17.319 9.375 16.9215 9.375 16.5071V13.0696C9.375 12.6552 9.21038 12.2578 8.91735 11.9648C8.62433 11.6718 8.2269 11.5071 7.8125 11.5071ZM7.5 16.1946H4.6875V13.3821H7.5V16.1946ZM15.625 11.5071H12.1875C11.7731 11.5071 11.3757 11.6718 11.0826 11.9648C10.7896 12.2578 10.625 12.6552 10.625 13.0696V16.5071C10.625 16.9215 10.7896 17.319 11.0826 17.612C11.3757 17.905 11.7731 18.0696 12.1875 18.0696H15.625C16.0394 18.0696 16.4368 17.905 16.7299 17.612C17.0229 17.319 17.1875 16.9215 17.1875 16.5071V13.0696C17.1875 12.6552 17.0229 12.2578 16.7299 11.9648C16.4368 11.6718 16.0394 11.5071 15.625 11.5071ZM15.3125 16.1946H12.5V13.3821H15.3125V16.1946Z"
        fill="currentColor"
      />
    </svg>
  ),
  house: ({ ...props }: LucideProps) => (
    <svg width="43" height="34" viewBox="0 0 43 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M29.8652 9.59953V3.19983H31.9985V9.59953H29.8652Z" fill="#196CB0" />
      <path d="M27.7324 5.33307H34.1321V7.4663H27.7324V5.33307Z" fill="#196CB0" />
      <path
        d="M35.1984 5.33309V2.13323H26.6654V5.33309V7.46632V8.53294V10.6662H35.1984V8.53294V7.46632V5.33309ZM1.06662 5.33309H24.5322V2.13323V0H26.6654H35.1984H37.3316V2.13323V5.33309H41.5981V7.46632H37.3316V8.53294H38.3982H40.5315V10.6662V30.9319H42.6647V33.0651H40.5315H38.3982H35.1984H33.0651H28.7987H26.6654H4.26647H2.13323H0V30.9319H2.13323V10.6662V8.53294H4.26647H24.5322V7.46632H1.06662V5.33309ZM24.5322 12.7994V10.6662H4.26647V30.9319H26.6654V18.1325V15.9993H28.7987H33.0651H35.1984V18.1325V30.9319H38.3982V10.6662H37.3316V12.7994H35.1984H26.6654H24.5322ZM21.3323 18.1325H9.59955V24.5322H21.3323V18.1325ZM7.46632 18.1325V24.5322H6.3997V26.6654H7.46632H9.59955H21.3323H23.4656H24.5322V24.5322H23.4656V18.1325V15.9993H21.3323H9.59955H7.46632V18.1325ZM28.7987 30.9319H33.0651V18.1325H28.7987V30.9319Z"
        fill="#196CB0"
      />
      <path d="M2.13281 10.6662V5.33307H4.26605V10.6662H2.13281Z" fill="#196CB0" />
      <path d="M38.3984 10.6662V5.33307H40.5317V10.6662H38.3984Z" fill="#196CB0" />
    </svg>
  ),
  hospital: ({ ...props }: LucideProps) => (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M25.5547 2.2222V0H27.7769V2.2222C27.7769 2.83584 28.2743 3.3333 28.888 3.3333H35.5546C36.7819 3.3333 37.7768 4.32821 37.7768 5.5555V19.9998C37.7768 20.6135 37.2794 21.1109 36.6657 21.1109C36.052 21.1109 35.5546 20.6135 35.5546 19.9998V5.5555H28.888C27.047 5.5555 25.5547 4.06313 25.5547 2.2222Z"
        fill="#196CB0"
      />
      <path
        d="M27.7769 8.88883V13.3332H29.9991V8.88883H27.7769ZM26.6658 6.66663C26.0521 6.66663 25.5547 7.16407 25.5547 7.77773V14.4443C25.5547 15.058 26.0521 15.5554 26.6658 15.5554H31.1102C31.7239 15.5554 32.2213 15.058 32.2213 14.4443V7.77773C32.2213 7.16407 31.7239 6.66663 31.1102 6.66663H26.6658Z"
        fill="#196CB0"
      />
      <path d="M27.7764 7.22216V3.33331H29.9986V7.22216H27.7764Z" fill="#196CB0" />
      <path
        d="M35.628 21.1849H15.6769C14.9916 21.1849 14.338 20.9104 13.8587 20.4279L15.4352 18.8618C15.4993 18.9263 15.5863 18.9627 15.6769 18.9627H35.628C38.042 18.9627 39.9989 20.9359 39.9989 23.37C39.9989 25.8042 38.042 27.7774 35.628 27.7774H12.3016C11.9695 27.7774 11.651 27.6445 11.416 27.4079L2.40704 18.338C0.678122 16.5974 0.678122 13.7724 2.40704 12.0317C4.13208 10.2951 6.92607 10.2951 8.65106 12.0317L15.4352 18.8618L13.8587 20.4279L7.07441 13.5978C6.21841 12.736 4.83965 12.736 3.98366 13.5978C3.11552 14.4718 3.11552 15.8979 3.98366 16.772L12.7079 25.5552H35.628C36.7973 25.5552 37.7767 24.5943 37.7767 23.37C37.7767 22.1456 36.7972 21.1849 35.628 21.1849Z"
        fill="#196CB0"
      />
      <path d="M3.33301 18.8892L5.55521 20.2023V33.3335H3.33301V18.8892Z" fill="#196CB0" />
      <path d="M33.333 27.2485H35.5552V33.5547H33.333V27.2485Z" fill="#196CB0" />
      <path d="M39.9996 33.3335H0V31.1113H39.9996V33.3335Z" fill="#196CB0" />
      <path
        d="M6.11053 37.7779C7.03097 37.7779 7.77718 37.0317 7.77718 36.1113C7.77718 35.1908 7.03097 34.4446 6.11053 34.4446C5.1901 34.4446 4.44388 35.1908 4.44388 36.1113C4.44388 37.0317 5.1901 37.7779 6.11053 37.7779ZM6.11053 40.0001C8.25829 40.0001 9.99938 38.259 9.99938 36.1113C9.99938 33.9635 8.25829 32.2224 6.11053 32.2224C3.96277 32.2224 2.22168 33.9635 2.22168 36.1113C2.22168 38.259 3.96277 40.0001 6.11053 40.0001Z"
        fill="#196CB0"
      />
      <path
        d="M33.8898 37.7779C34.8103 37.7779 35.5565 37.0317 35.5565 36.1113C35.5565 35.1908 34.8103 34.4446 33.8898 34.4446C32.9694 34.4446 32.2232 35.1908 32.2232 36.1113C32.2232 37.0317 32.9694 37.7779 33.8898 37.7779ZM33.8898 40.0001C36.0376 40.0001 37.7787 38.259 37.7787 36.1113C37.7787 33.9635 36.0376 32.2224 33.8898 32.2224C31.7421 32.2224 30.001 33.9635 30.001 36.1113C30.001 38.259 31.7421 40.0001 33.8898 40.0001Z"
        fill="#196CB0"
      />
      <path
        d="M7.51711 10.1148C9.15398 8.47941 11.8068 8.4803 13.4425 10.1168L15.4427 12.118C17.0786 13.7547 17.0777 16.4073 15.4407 18.0429L13.8074 19.6748L12.2367 18.1028L13.87 16.4709C14.6387 15.7029 14.6392 14.4575 13.871 13.689L11.8708 11.6878C11.1026 10.9192 9.85653 10.9187 9.08776 11.6868L7.45444 13.3187L5.88379 11.7467L7.51711 10.1148Z"
        fill="#196CB0"
      />
    </svg>
  ),

  accredit: ({ ...props }: LucideProps) => (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7.0625 2.13214V1.81964C7.0625 1.571 7.16127 1.33254 7.33709 1.15673C7.5129 0.980913 7.75136 0.882141 8 0.882141C8.24864 0.882141 8.4871 0.980913 8.66291 1.15673C8.83873 1.33254 8.9375 1.571 8.9375 1.81964V2.13214C8.9375 2.38078 8.83873 2.61924 8.66291 2.79505C8.4871 2.97087 8.24864 3.06964 8 3.06964C7.75136 3.06964 7.5129 2.97087 7.33709 2.79505C7.16127 2.61924 7.0625 2.38078 7.0625 2.13214ZM1.75 9.31964C1.99864 9.31964 2.2371 9.22087 2.41291 9.04505C2.58873 8.86924 2.6875 8.63078 2.6875 8.38214C2.6875 8.1335 2.58873 7.89504 2.41291 7.71923C2.2371 7.54341 1.99864 7.44464 1.75 7.44464H1.4375C1.18886 7.44464 0.950403 7.54341 0.774587 7.71923C0.598772 7.89504 0.5 8.1335 0.5 8.38214C0.5 8.63078 0.598772 8.86924 0.774587 9.04505C0.950403 9.22087 1.18886 9.31964 1.4375 9.31964H1.75ZM10.5156 3.9587C10.6324 3.99765 10.7558 4.0132 10.8786 4.00448C11.0014 3.99575 11.1213 3.96292 11.2314 3.90786C11.3415 3.8528 11.4397 3.77658 11.5204 3.68356C11.6011 3.59054 11.6626 3.48254 11.7016 3.36574L12.0141 2.42823C12.0841 2.19477 12.0604 1.94322 11.948 1.72691C11.8357 1.51061 11.6435 1.34657 11.4123 1.26955C11.181 1.19254 10.9289 1.20861 10.7093 1.31436C10.4897 1.42011 10.3199 1.60723 10.2359 1.83605L9.92344 2.77355C9.84499 3.00924 9.86329 3.26644 9.97433 3.48865C10.0854 3.71086 10.28 3.87992 10.5156 3.9587ZM2.39062 10.3056L1.45312 10.6181C1.33291 10.6541 1.22116 10.7139 1.12449 10.794C1.02782 10.874 0.948204 10.9726 0.89036 11.084C0.832516 11.1954 0.797622 11.3172 0.787747 11.4423C0.777872 11.5674 0.793216 11.6933 0.832871 11.8123C0.872526 11.9314 0.935684 12.0413 1.0186 12.1355C1.10152 12.2297 1.2025 12.3063 1.31557 12.3608C1.42864 12.4152 1.5515 12.4464 1.67685 12.4525C1.8022 12.4586 1.9275 12.4394 2.04531 12.3962L2.98281 12.0837C3.10303 12.0477 3.21478 11.9879 3.31145 11.9078C3.40812 11.8278 3.48773 11.7292 3.54558 11.6178C3.60342 11.5064 3.63832 11.3846 3.64819 11.2595C3.65807 11.1343 3.64272 11.0085 3.60307 10.8895C3.56341 10.7704 3.50025 10.6605 3.41734 10.5663C3.33442 10.4721 3.23343 10.3955 3.12036 10.341C3.00729 10.2866 2.88444 10.2554 2.75909 10.2493C2.63374 10.2432 2.50844 10.2623 2.39062 10.3056ZM17.8539 15.036C17.9991 15.1811 18.1142 15.3534 18.1928 15.543C18.2713 15.7326 18.3118 15.9359 18.3118 16.1411C18.3118 16.3464 18.2713 16.5496 18.1928 16.7392C18.1142 16.9288 17.9991 17.1011 17.8539 17.2462L16.8633 18.2368C16.7182 18.382 16.5459 18.4971 16.3563 18.5757C16.1667 18.6543 15.9634 18.6947 15.7582 18.6947C15.553 18.6947 15.3497 18.6543 15.1601 18.5757C14.9705 18.4971 14.7982 18.382 14.6531 18.2368L11.0977 14.6814L9.76094 17.7571C9.64123 18.0362 9.44207 18.2739 9.18827 18.4406C8.93447 18.6073 8.63724 18.6956 8.33359 18.6946H8.25547C7.93946 18.6809 7.63527 18.5706 7.38385 18.3787C7.13242 18.1867 6.94584 17.9224 6.84922 17.6212L2.76562 5.11339C2.67772 4.83986 2.66694 4.54739 2.73446 4.26814C2.80198 3.98888 2.94519 3.73364 3.14834 3.53048C3.3515 3.32733 3.60673 3.18412 3.88599 3.1166C4.16525 3.04908 4.45772 3.05986 4.73125 3.14777L17.2375 7.23136C17.5368 7.33104 17.7988 7.51895 17.9893 7.77039C18.1797 8.02183 18.2896 8.32501 18.3045 8.64008C18.3194 8.95515 18.2385 9.26734 18.0726 9.5356C17.9067 9.80387 17.6635 10.0156 17.375 10.1431L14.2992 11.4806L17.8539 15.036ZM16.307 16.1407L12.6484 12.4814C12.4686 12.3013 12.3355 12.08 12.2607 11.8367C12.1858 11.5935 12.1715 11.3356 12.2191 11.0856C12.2666 10.8356 12.3744 10.6009 12.5333 10.4021C12.6921 10.2033 12.8971 10.0462 13.1305 9.94464L15.8648 8.75636L4.74141 5.12355L8.37344 16.2462L9.56172 13.5118C9.6634 13.2785 9.82053 13.0736 10.0195 12.9148C10.2184 12.7561 10.4531 12.6483 10.7031 12.6009C10.7994 12.5822 10.8972 12.5728 10.9953 12.5728C11.4094 12.5731 11.8065 12.7377 12.0992 13.0306L15.7586 16.69L16.307 16.1407Z"
        fill="currentColor"
      />
    </svg>
  ),
  dismiss: ({ ...props }: LucideProps) => (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18.3125 9.35089C18.6653 9.27888 18.9824 9.08723 19.2102 8.80835C19.4379 8.52948 19.5624 8.18049 19.5625 7.82042V5.88214C19.5625 5.46774 19.3979 5.07031 19.1049 4.77729C18.8118 4.48426 18.4144 4.31964 18 4.31964H3C2.5856 4.31964 2.18817 4.48426 1.89515 4.77729C1.60212 5.07031 1.4375 5.46774 1.4375 5.88214V7.82042C1.43761 8.18049 1.56207 8.52948 1.78984 8.80835C2.01761 9.08723 2.3347 9.27888 2.6875 9.35089C3.04072 9.42261 3.35827 9.61424 3.58637 9.89331C3.81446 10.1724 3.93907 10.5217 3.93907 10.8821C3.93907 11.2426 3.81446 11.5919 3.58637 11.871C3.35827 12.15 3.04072 12.3417 2.6875 12.4134C2.3347 12.4854 2.01761 12.6771 1.78984 12.9559C1.56207 13.2348 1.43761 13.5838 1.4375 13.9439V15.8821C1.4375 16.2965 1.60212 16.694 1.89515 16.987C2.18817 17.28 2.5856 17.4446 3 17.4446H18C18.4144 17.4446 18.8118 17.28 19.1049 16.987C19.3979 16.694 19.5625 16.2965 19.5625 15.8821V13.9439C19.5624 13.5838 19.4379 13.2348 19.2102 12.9559C18.9824 12.6771 18.6653 12.4854 18.3125 12.4134C17.9593 12.3417 17.6417 12.15 17.4136 11.871C17.1855 11.5919 17.0609 11.2426 17.0609 10.8821C17.0609 10.5217 17.1855 10.1724 17.4136 9.89331C17.6417 9.61424 17.9593 9.42261 18.3125 9.35089ZM3.3125 14.19C4.03287 13.9863 4.66706 13.553 5.11869 12.9559C5.57032 12.3589 5.8147 11.6308 5.8147 10.8821C5.8147 10.1335 5.57032 9.40538 5.11869 8.80834C4.66706 8.2113 4.03287 7.77802 3.3125 7.57433V6.19464H7.0625V15.5696H3.3125V14.19ZM17.6875 14.19V15.5696H8.9375V6.19464H17.6875V7.57433C16.9671 7.77802 16.3329 8.2113 15.8813 8.80834C15.4297 9.40538 15.1853 10.1335 15.1853 10.8821C15.1853 11.6308 15.4297 12.3589 15.8813 12.9559C16.3329 13.553 16.9671 13.9863 17.6875 14.19Z"
        fill="currentColor"
      />
    </svg>
  ),
  Statistics: ({ ...props }: LucideProps) => (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M18 16.1946H17.6875V4.00714C17.6875 3.7585 17.5887 3.52004 17.4129 3.34423C17.2371 3.16841 16.9986 3.06964 16.75 3.06964H12.375C12.1264 3.06964 11.8879 3.16841 11.7121 3.34423C11.5363 3.52004 11.4375 3.7585 11.4375 4.00714V6.81964H8C7.75136 6.81964 7.5129 6.91841 7.33709 7.09423C7.16127 7.27004 7.0625 7.5085 7.0625 7.75714V10.5696H4.25C4.00136 10.5696 3.7629 10.6684 3.58709 10.8442C3.41127 11.02 3.3125 11.2585 3.3125 11.5071V16.1946H3C2.75136 16.1946 2.5129 16.2934 2.33709 16.4692C2.16127 16.645 2.0625 16.8835 2.0625 17.1321C2.0625 17.3808 2.16127 17.6192 2.33709 17.7951C2.5129 17.9709 2.75136 18.0696 3 18.0696H18C18.2486 18.0696 18.4871 17.9709 18.6629 17.7951C18.8387 17.6192 18.9375 17.3808 18.9375 17.1321C18.9375 16.8835 18.8387 16.645 18.6629 16.4692C18.4871 16.2934 18.2486 16.1946 18 16.1946ZM13.3125 4.94464H15.8125V16.1946H13.3125V4.94464ZM8.9375 8.69464H11.4375V16.1946H8.9375V8.69464ZM5.1875 12.4446H7.0625V16.1946H5.1875V12.4446Z"
        fill="currentColor"
      />
    </svg>
  ),
  LogOut: ({ ...props }: LucideProps) => (
    <svg
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M11.4375 17.2879C11.4375 17.5365 11.5363 17.775 11.7121 17.9508C11.8879 18.1266 12.1264 18.2254 12.375 18.2254H16.75C17.1644 18.2254 17.5618 18.0608 17.8549 17.7678C18.1479 17.4747 18.3125 17.0773 18.3125 16.6629V4.1629C18.3125 3.7485 18.1479 3.35107 17.8549 3.05805C17.5618 2.76502 17.1644 2.6004 16.75 2.6004H12.375C12.1264 2.6004 11.8879 2.69917 11.7121 2.87499C11.5363 3.05081 11.4375 3.28926 11.4375 3.5379C11.4375 3.78654 11.5363 4.025 11.7121 4.20082C11.8879 4.37663 12.1264 4.4754 12.375 4.4754H16.4375V16.3504H12.375C12.1264 16.3504 11.8879 16.4492 11.7121 16.625C11.5363 16.8008 11.4375 17.0393 11.4375 17.2879ZM2.96172 9.74962L6.08672 6.62462C6.26284 6.4485 6.50171 6.34956 6.75078 6.34956C6.99985 6.34956 7.23872 6.4485 7.41484 6.62462C7.59096 6.80074 7.68991 7.03961 7.68991 7.28868C7.68991 7.53776 7.59096 7.77663 7.41484 7.95275L5.89063 9.4754H12.375C12.6236 9.4754 12.8621 9.57417 13.0379 9.74999C13.2137 9.92581 13.3125 10.1643 13.3125 10.4129C13.3125 10.6615 13.2137 10.9 13.0379 11.0758C12.8621 11.2516 12.6236 11.3504 12.375 11.3504H5.89063L7.41563 12.8746C7.59175 13.0507 7.69069 13.2896 7.69069 13.5387C7.69069 13.7878 7.59175 14.0266 7.41563 14.2027C7.23951 14.3789 7.00064 14.4778 6.75156 14.4778C6.50249 14.4778 6.26362 14.3789 6.0875 14.2027L2.9625 11.0777C2.87505 10.9907 2.80564 10.8872 2.75826 10.7733C2.71087 10.6594 2.68644 10.5372 2.68637 10.4138C2.6863 10.2905 2.71058 10.1683 2.75784 10.0543C2.80509 9.9403 2.87437 9.83677 2.96172 9.74962Z"
        fill="currentColor"
      />
    </svg>
  ),

  gitHub: ({ ...props }: LucideProps) => (
    <svg
      aria-hidden="true"
      focusable="false"
      data-prefix="fab"
      data-icon="github"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 496 512"
      {...props}
    >
      <path
        fill="currentColor"
        d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
      ></path>
    </svg>
  ),

  category: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M7 10.75H5C2.58 10.75 1.25 9.42 1.25 7V5C1.25 2.58 2.58 1.25 5 1.25H7C9.42 1.25 10.75 2.58 10.75 5V7C10.75 9.42 9.42 10.75 7 10.75ZM5 2.75C3.42 2.75 2.75 3.42 2.75 5V7C2.75 8.58 3.42 9.25 5 9.25H7C8.58 9.25 9.25 8.58 9.25 7V5C9.25 3.42 8.58 2.75 7 2.75H5Z"
        fill="#787486"
      />
      <path
        d="M19 10.75H17C14.58 10.75 13.25 9.42 13.25 7V5C13.25 2.58 14.58 1.25 17 1.25H19C21.42 1.25 22.75 2.58 22.75 5V7C22.75 9.42 21.42 10.75 19 10.75ZM17 2.75C15.42 2.75 14.75 3.42 14.75 5V7C14.75 8.58 15.42 9.25 17 9.25H19C20.58 9.25 21.25 8.58 21.25 7V5C21.25 3.42 20.58 2.75 19 2.75H17Z"
        fill="#787486"
      />
      <path
        d="M19 22.75H17C14.58 22.75 13.25 21.42 13.25 19V17C13.25 14.58 14.58 13.25 17 13.25H19C21.42 13.25 22.75 14.58 22.75 17V19C22.75 21.42 21.42 22.75 19 22.75ZM17 14.75C15.42 14.75 14.75 15.42 14.75 17V19C14.75 20.58 15.42 21.25 17 21.25H19C20.58 21.25 21.25 20.58 21.25 19V17C21.25 15.42 20.58 14.75 19 14.75H17Z"
        fill="#787486"
      />
      <path
        d="M7 22.75H5C2.58 22.75 1.25 21.42 1.25 19V17C1.25 14.58 2.58 13.25 5 13.25H7C9.42 13.25 10.75 14.58 10.75 17V19C10.75 21.42 9.42 22.75 7 22.75ZM5 14.75C3.42 14.75 2.75 15.42 2.75 17V19C2.75 20.58 3.42 21.25 5 21.25H7C8.58 21.25 9.25 20.58 9.25 19V17C9.25 15.42 8.58 14.75 7 14.75H5Z"
        fill="#787486"
      />
    </svg>
  ),
  taskSquare: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12.3701 8.88H17.6201"
        stroke="#8150AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.37988 8.88L7.12988 9.63L9.37988 7.38"
        stroke="#8150AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.3701 15.88H17.6201"
        stroke="#8150AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.37988 15.88L7.12988 16.63L9.37988 14.38"
        stroke="#8150AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z"
        stroke="#8150AB"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  bookmark: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15.31 15.02C14.73 15.02 14.1 14.83 13.47 14.44L12.15 13.64C12.09 13.6 11.91 13.6 11.85 13.64L10.53 14.44C9.45 15.1 8.39 15.2 7.54 14.72C6.71 14.25 6.25 13.31 6.25 12.08V5.03C6.25 2.59 7.58 1.25 10 1.25H14C16.42 1.25 17.75 2.59 17.75 5.03V12.08C17.75 13.32 17.29 14.26 16.46 14.72C16.11 14.92 15.72 15.02 15.31 15.02ZM12 12.11C12.33 12.11 12.66 12.19 12.93 12.35L14.25 13.15C14.84 13.51 15.38 13.6 15.72 13.41C16.05 13.22 16.24 12.73 16.24 12.07V5.03C16.24 3.43 15.57 2.75 13.99 2.75H9.99C8.41 2.75 7.74 3.43 7.74 5.03V12.08C7.74 12.74 7.93 13.23 8.26 13.42C8.6 13.61 9.14 13.52 9.73 13.16L11.05 12.36C11.34 12.19 11.67 12.11 12 12.11Z"
        fill="#787486"
      />
      <path
        d="M15 22.75H9C3.57 22.75 1.25 20.41 1.25 14.93V11.9C1.25 7.24001 2.93 4.88001 6.69 4.25001C7.09 4.18001 7.48 4.46001 7.55 4.87001C7.62 5.28001 7.34 5.66001 6.93 5.73001C3.92 6.23001 2.74 7.96001 2.74 11.9V14.93C2.74 19.54 4.43 21.25 8.99 21.25H14.99C19.55 21.25 21.24 19.54 21.24 14.93V11.9C21.24 7.90001 20.02 6.17001 16.88 5.70001C16.47 5.64001 16.19 5.26001 16.25 4.85001C16.31 4.44001 16.69 4.16001 17.1 4.22001C21 4.80001 22.74 7.16001 22.74 11.9V14.93C22.75 20.41 20.43 22.75 15 22.75Z"
        fill="#787486"
      />
    </svg>
  ),
  calendarTick: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M8 5.75C7.59 5.75 7.25 5.41 7.25 5V2C7.25 1.59 7.59 1.25 8 1.25C8.41 1.25 8.75 1.59 8.75 2V5C8.75 5.41 8.41 5.75 8 5.75Z"
        fill="#787486"
      />
      <path
        d="M16 5.75C15.59 5.75 15.25 5.41 15.25 5V2C15.25 1.59 15.59 1.25 16 1.25C16.41 1.25 16.75 1.59 16.75 2V5C16.75 5.41 16.41 5.75 16 5.75Z"
        fill="#787486"
      />
      <path
        d="M8.5 14.5C8.24 14.5 7.98 14.39 7.79 14.21C7.61 14.02 7.5 13.77 7.5 13.5C7.5 13.37 7.53 13.24 7.58 13.12C7.63 13 7.7 12.89 7.79 12.79C8.16 12.42 8.83 12.42 9.21 12.79C9.39 12.98 9.5 13.24 9.5 13.5C9.5 13.56 9.49 13.63 9.48 13.7C9.47 13.76 9.45 13.82 9.42 13.88C9.4 13.94 9.37 14 9.33 14.06C9.29 14.11 9.25 14.16 9.21 14.21C9.02 14.39 8.76 14.5 8.5 14.5Z"
        fill="#787486"
      />
      <path
        d="M12 14.5C11.87 14.5 11.74 14.47 11.62 14.42C11.49 14.37 11.39 14.3 11.29 14.21C11.11 14.02 11 13.77 11 13.5C11 13.37 11.03 13.24 11.08 13.12C11.13 13 11.2 12.89 11.29 12.79C11.39 12.7 11.49 12.63 11.62 12.58C11.99 12.43 12.43 12.51 12.71 12.79C12.89 12.98 13 13.24 13 13.5C13 13.56 12.99 13.63 12.98 13.7C12.97 13.76 12.95 13.82 12.92 13.88C12.9 13.94 12.87 14 12.83 14.06C12.8 14.11 12.75 14.16 12.71 14.21C12.52 14.39 12.26 14.5 12 14.5Z"
        fill="#787486"
      />
      <path
        d="M8.5 18C8.37 18 8.24 17.97 8.12 17.92C7.99 17.87 7.88 17.8 7.79 17.71C7.7 17.62 7.63 17.51 7.58 17.38C7.53 17.26 7.5 17.13 7.5 17C7.5 16.87 7.53 16.74 7.58 16.62C7.63 16.49 7.7 16.38 7.79 16.29C7.88 16.2 7.99 16.13 8.12 16.08C8.36 15.98 8.64 15.97 8.88 16.08C9.01 16.13 9.12 16.2 9.21 16.29C9.3 16.38 9.37 16.49 9.42 16.62C9.47 16.74 9.5 16.87 9.5 17C9.5 17.13 9.47 17.26 9.42 17.38C9.37 17.51 9.3 17.62 9.21 17.71C9.12 17.8 9.01 17.87 8.88 17.92C8.76 17.97 8.63 18 8.5 18Z"
        fill="#787486"
      />
      <path
        d="M20.5 9.83997H3.5C3.09 9.83997 2.75 9.49997 2.75 9.08997C2.75 8.67997 3.09 8.33997 3.5 8.33997H20.5C20.91 8.33997 21.25 8.67997 21.25 9.08997C21.25 9.49997 20.91 9.83997 20.5 9.83997Z"
        fill="#787486"
      />
      <path
        d="M18 23.75C16.83 23.75 15.72 23.33 14.87 22.56C14.51 22.26 14.19 21.88 13.93 21.44C13.49 20.72 13.25 19.87 13.25 19C13.25 16.38 15.38 14.25 18 14.25C19.36 14.25 20.66 14.84 21.56 15.86C22.33 16.74 22.75 17.85 22.75 19C22.75 19.87 22.51 20.72 22.06 21.45C21.22 22.87 19.66 23.75 18 23.75ZM18 15.75C16.21 15.75 14.75 17.21 14.75 19C14.75 19.59 14.91 20.17 15.22 20.67C15.39 20.97 15.61 21.22 15.85 21.43C16.45 21.97 17.2 22.25 18 22.25C19.15 22.25 20.19 21.66 20.78 20.68C21.09 20.17 21.25 19.6 21.25 19C21.25 18.22 20.96 17.46 20.44 16.85C19.82 16.15 18.93 15.75 18 15.75Z"
        fill="#787486"
      />
      <path
        d="M17.4299 20.74C17.2399 20.74 17.0499 20.67 16.8999 20.52L15.9099 19.53C15.6199 19.24 15.6199 18.76 15.9099 18.47C16.1999 18.18 16.6799 18.18 16.9699 18.47L17.4499 18.95L19.0499 17.47C19.3499 17.19 19.8299 17.21 20.1099 17.51C20.3899 17.81 20.3699 18.29 20.0699 18.57L17.9399 20.54C17.7899 20.67 17.6099 20.74 17.4299 20.74Z"
        fill="#787486"
      />
      <path
        d="M15.37 22.75H8C4.35 22.75 2.25 20.65 2.25 17V8.5C2.25 4.85 4.35 2.75 8 2.75H16C19.65 2.75 21.75 4.85 21.75 8.5V16.36C21.75 16.67 21.56 16.95 21.26 17.06C20.97 17.17 20.64 17.09 20.43 16.85C19.81 16.15 18.92 15.75 17.99 15.75C16.2 15.75 14.74 17.21 14.74 19C14.74 19.59 14.9 20.17 15.21 20.67C15.38 20.97 15.6 21.22 15.84 21.43C16.08 21.63 16.17 21.96 16.06 22.26C15.97 22.55 15.69 22.75 15.37 22.75ZM8 4.25C5.14 4.25 3.75 5.64 3.75 8.5V17C3.75 19.86 5.14 21.25 8 21.25H13.82C13.45 20.57 13.25 19.8 13.25 19C13.25 16.38 15.38 14.25 18 14.25C18.79 14.25 19.57 14.45 20.25 14.82V8.5C20.25 5.64 18.86 4.25 16 4.25H8Z"
        fill="#787486"
      />
    </svg>
  ),
  archive: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M15 22.75H9C3.57 22.75 1.25 20.43 1.25 15V9C1.25 3.57 3.57 1.25 9 1.25H15C20.43 1.25 22.75 3.57 22.75 9V15C22.75 20.43 20.43 22.75 15 22.75ZM9 2.75C4.39 2.75 2.75 4.39 2.75 9V15C2.75 19.61 4.39 21.25 9 21.25H15C19.61 21.25 21.25 19.61 21.25 15V9C21.25 4.39 19.61 2.75 15 2.75H9Z"
        fill="#787486"
      />
      <path
        d="M18 15.25C17.59 15.25 17.25 14.91 17.25 14.5C17.25 13.81 16.69 13.25 16 13.25H8C7.31 13.25 6.75 13.81 6.75 14.5C6.75 14.91 6.41 15.25 6 15.25C5.59 15.25 5.25 14.91 5.25 14.5V7.75C5.25 6.23 6.48 5 8 5H16C17.52 5 18.75 6.23 18.75 7.75V14.5C18.75 14.91 18.41 15.25 18 15.25ZM8 11.75H16C16.45 11.75 16.88 11.86 17.25 12.05V7.75C17.25 7.06 16.69 6.5 16 6.5H8C7.31 6.5 6.75 7.06 6.75 7.75V12.05C7.12 11.86 7.55 11.75 8 11.75Z"
        fill="#787486"
      />
      <path
        d="M19 16.5H18C17.59 16.5 17.25 16.16 17.25 15.75C17.25 15.34 17.59 15 18 15H19C19.41 15 19.75 15.34 19.75 15.75C19.75 16.16 19.41 16.5 19 16.5Z"
        fill="#787486"
      />
      <path
        d="M6 16.5H5C4.59 16.5 4.25 16.16 4.25 15.75C4.25 15.34 4.59 15 5 15H6C6.41 15 6.75 15.34 6.75 15.75C6.75 16.16 6.41 16.5 6 16.5Z"
        fill="#787486"
      />
      <path
        d="M18 14.75C17.59 14.75 17.25 14.41 17.25 14V11C17.25 10.31 16.69 9.75 16 9.75H8C7.31 9.75 6.75 10.31 6.75 11V14C6.75 14.41 6.41 14.75 6 14.75C5.59 14.75 5.25 14.41 5.25 14V11C5.25 9.48 6.48 8.25 8 8.25H16C17.52 8.25 18.75 9.48 18.75 11V14C18.75 14.41 18.41 14.75 18 14.75Z"
        fill="#787486"
      />
      <path
        d="M12 19C10.47 19 9.18003 17.93 8.84003 16.5H6C5.59 16.5 5.25 16.16 5.25 15.75V14.5C5.25 12.98 6.48 11.75 8 11.75H16C17.52 11.75 18.75 12.98 18.75 14.5V15.75C18.75 16.16 18.41 16.5 18 16.5H15.16C14.82 17.93 13.53 19 12 19ZM6.75 15H9.5C9.91 15 10.25 15.34 10.25 15.75C10.25 16.71 11.04 17.5 12 17.5C12.96 17.5 13.75 16.71 13.75 15.75C13.75 15.34 14.09 15 14.5 15H17.25V14.5C17.25 13.81 16.69 13.25 16 13.25H8C7.31 13.25 6.75 13.81 6.75 14.5V15Z"
        fill="#787486"
      />
    </svg>
  ),
  profileUser: ({ ...props }: LucideProps) => (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.16006 10.87C9.06006 10.86 8.94006 10.86 8.83006 10.87C6.45006 10.79 4.56006 8.84 4.56006 6.44C4.56006 3.99 6.54006 2 9.00006 2C11.4501 2 13.4401 3.99 13.4401 6.44C13.4301 8.84 11.5401 10.79 9.16006 10.87Z"
        stroke="#787486"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.41 4C18.35 4 19.91 5.57 19.91 7.5C19.91 9.39 18.41 10.93 16.54 11C16.46 10.99 16.37 10.99 16.28 11"
        stroke="#787486"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.15997 14.56C1.73997 16.18 1.73997 18.82 4.15997 20.43C6.90997 22.27 11.42 22.27 14.17 20.43C16.59 18.81 16.59 16.17 14.17 14.56C11.43 12.73 6.91997 12.73 4.15997 14.56Z"
        stroke="#787486"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3401 20C19.0601 19.85 19.7401 19.56 20.3001 19.13C21.8601 17.96 21.8601 16.03 20.3001 14.86C19.7501 14.44 19.0801 14.16 18.3701 14"
        stroke="#787486"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  userTick: ({ ...props }: LucideProps) => (
    <svg
      width="61"
      height="60"
      viewBox="0 0 61 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M30.3334 31.5625C23.7292 31.5625 18.3542 26.1875 18.3542 19.5834C18.3542 12.9792 23.7292 7.60419 30.3334 7.60419C36.9376 7.60419 42.3126 12.9792 42.3126 19.5834C42.3126 26.1875 36.9376 31.5625 30.3334 31.5625ZM30.3334 10.7292C25.4584 10.7292 21.4792 14.7084 21.4792 19.5834C21.4792 24.4584 25.4584 28.4375 30.3334 28.4375C35.2084 28.4375 39.1876 24.4584 39.1876 19.5834C39.1876 14.7084 35.2084 10.7292 30.3334 10.7292Z"
        fill="#0CAF60"
      />
      <path
        d="M12.438 52.3958C11.5838 52.3958 10.8755 51.6875 10.8755 50.8333C10.8755 41.9375 19.6046 34.6875 30.3338 34.6875C32.438 34.6875 34.5005 34.9584 36.5005 35.5209C37.3338 35.7501 37.813 36.6042 37.5838 37.4375C37.3547 38.2708 36.5005 38.7501 35.6671 38.5209C33.9588 38.0417 32.1671 37.8125 30.3338 37.8125C21.3338 37.8125 14.0005 43.6458 14.0005 50.8333C14.0005 51.6875 13.2922 52.3958 12.438 52.3958Z"
        fill="#0CAF60"
      />
      <path
        d="M42.8336 52.3959C39.3752 52.3959 36.1252 50.5625 34.3752 47.5834C33.4377 46.0834 32.9377 44.3125 32.9377 42.5C32.9377 39.4584 34.2919 36.6458 36.6461 34.7708C38.3961 33.375 40.6044 32.6042 42.8336 32.6042C48.2919 32.6042 52.7294 37.0417 52.7294 42.5C52.7294 44.3125 52.2294 46.0834 51.2919 47.6042C50.7711 48.4792 50.1044 49.2709 49.3127 49.9375C47.5835 51.5209 45.2711 52.3959 42.8336 52.3959ZM42.8336 35.7292C41.2919 35.7292 39.8336 36.25 38.6044 37.2291C37.0002 38.5 36.0627 40.4375 36.0627 42.5C36.0627 43.7292 36.3961 44.9375 37.0419 45.9792C38.2502 48.0208 40.4794 49.2709 42.8336 49.2709C44.4794 49.2709 46.0628 48.6667 47.2711 47.5834C47.8128 47.125 48.2711 46.5833 48.6044 46C49.2711 44.9375 49.6044 43.7292 49.6044 42.5C49.6044 38.7709 46.5627 35.7292 42.8336 35.7292Z"
        fill="#0CAF60"
      />
      <path
        d="M41.6456 46.1251C41.2498 46.1251 40.854 45.9794 40.5415 45.6669L38.479 43.6044C37.8748 43.0002 37.8748 42.0001 38.479 41.3959C39.0832 40.7918 40.0832 40.7918 40.6873 41.3959L41.6874 42.396L45.0206 39.3126C45.6456 38.7293 46.6456 38.771 47.229 39.396C47.8123 40.021 47.7707 41.021 47.1457 41.6043L42.7082 45.7084C42.3957 45.9793 42.0206 46.1251 41.6456 46.1251Z"
        fill="#0CAF60"
      />
    </svg>
  ),
  userMinus: ({ ...props }: LucideProps) => (
    <svg
      width="61"
      height="60"
      viewBox="0 0 61 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M30.6667 31.5625C24.0625 31.5625 18.6875 26.1875 18.6875 19.5834C18.6875 12.9792 24.0625 7.60419 30.6667 7.60419C37.2708 7.60419 42.6458 12.9792 42.6458 19.5834C42.6458 26.1875 37.2708 31.5625 30.6667 31.5625ZM30.6667 10.7292C25.7917 10.7292 21.8125 14.7084 21.8125 19.5834C21.8125 24.4584 25.7917 28.4375 30.6667 28.4375C35.5417 28.4375 39.5208 24.4584 39.5208 19.5834C39.5208 14.7084 35.5417 10.7292 30.6667 10.7292Z"
        fill="#FE964A"
      />
      <path
        d="M12.7712 52.3958C11.9171 52.3958 11.2087 51.6875 11.2087 50.8333C11.2087 41.9375 19.938 34.6875 30.6671 34.6875C32.7713 34.6875 34.8338 34.9584 36.8338 35.5209C37.6672 35.7501 38.1463 36.6042 37.9171 37.4375C37.6879 38.2708 36.8338 38.7501 36.0005 38.5209C34.2921 38.0417 32.5005 37.8125 30.6671 37.8125C21.6671 37.8125 14.3337 43.6458 14.3337 50.8333C14.3337 51.6875 13.6254 52.3958 12.7712 52.3958Z"
        fill="#FE964A"
      />
      <path
        d="M43.1668 52.3959C40.7085 52.3959 38.3752 51.4792 36.5627 49.8334C35.8335 49.2084 35.1876 48.4375 34.6876 47.5834C33.771 46.0834 33.271 44.3125 33.271 42.5C33.271 39.8959 34.2711 37.4584 36.0627 35.6042C37.9377 33.6667 40.4585 32.6042 43.1668 32.6042C46.0002 32.6042 48.6877 33.8126 50.5211 35.8959C52.1461 37.7084 53.0627 40.0417 53.0627 42.5C53.0627 43.2917 52.9584 44.0833 52.7501 44.8333C52.5418 45.7708 52.146 46.75 51.6043 47.6042C49.8751 50.5625 46.6252 52.3959 43.1668 52.3959ZM43.1668 35.7292C41.3127 35.7292 39.6043 36.4583 38.3126 37.7708C37.0835 39.0416 36.396 40.7084 36.396 42.5C36.396 43.7292 36.7293 44.9375 37.3751 45.9792C37.7084 46.5625 38.146 47.0833 38.646 47.5208C39.896 48.6666 41.5002 49.2917 43.1668 49.2917C45.521 49.2917 47.7502 48.0417 48.9586 46.0209C49.3127 45.4375 49.5835 44.7709 49.7294 44.1251C49.8752 43.5834 49.9377 43.0625 49.9377 42.5209C49.9377 40.8542 49.3126 39.2501 48.1876 38.0001C46.9376 36.5417 45.1043 35.7292 43.1668 35.7292Z"
        fill="#FE964A"
      />
      <path
        d="M46.2912 44.0208H40.062C39.2078 44.0208 38.4995 43.3125 38.4995 42.4583C38.4995 41.6041 39.2078 40.8958 40.062 40.8958H46.2912C47.1453 40.8958 47.8537 41.6041 47.8537 42.4583C47.8537 43.3125 47.1453 44.0208 46.2912 44.0208Z"
        fill="#FE964A"
      />
    </svg>
  ),
  userRemove: ({ ...props }: LucideProps) => (
    <svg
      width="60"
      height="60"
      viewBox="0 0 60 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M30 31.5625C23.3959 31.5625 18.0209 26.1875 18.0209 19.5834C18.0209 12.9792 23.3959 7.60419 30 7.60419C36.6042 7.60419 41.9792 12.9792 41.9792 19.5834C41.9792 26.1875 36.6042 31.5625 30 31.5625ZM30 10.7292C25.125 10.7292 21.1459 14.7084 21.1459 19.5834C21.1459 24.4584 25.125 28.4375 30 28.4375C34.875 28.4375 38.8542 24.4584 38.8542 19.5834C38.8542 14.7084 34.875 10.7292 30 10.7292Z"
        fill="#FD6A6A"
      />
      <path
        d="M12.1045 52.3958C11.2503 52.3958 10.542 51.6875 10.542 50.8333C10.542 41.9375 19.2712 34.6875 30.0003 34.6875C32.1045 34.6875 34.167 34.9584 36.167 35.5209C37.0003 35.7501 37.4795 36.6042 37.2503 37.4375C37.0212 38.2708 36.167 38.7501 35.3336 38.5209C33.6253 38.0417 31.8337 37.8125 30.0003 37.8125C21.0003 37.8125 13.667 43.6458 13.667 50.8333C13.667 51.6875 12.9587 52.3958 12.1045 52.3958Z"
        fill="#FD6A6A"
      />
      <path
        d="M42.5 52.3959C40.0416 52.3959 37.7083 51.4792 35.8958 49.8334C35.1666 49.2084 34.5208 48.4375 34.0208 47.5834C33.1041 46.0834 32.6041 44.3125 32.6041 42.5C32.6041 39.8959 33.6041 37.4584 35.3958 35.6042C37.2708 33.6667 39.7916 32.6042 42.5 32.6042C45.3333 32.6042 48.0208 33.8126 49.8541 35.8959C51.4791 37.7084 52.3958 40.0417 52.3958 42.5C52.3958 43.2917 52.2916 44.0833 52.0833 44.8333C51.875 45.7708 51.4791 46.75 50.9374 47.6042C49.2083 50.5625 45.9583 52.3959 42.5 52.3959ZM42.5 35.7292C40.6458 35.7292 38.9375 36.4583 37.6458 37.7708C36.4167 39.0416 35.7291 40.7084 35.7291 42.5C35.7291 43.7292 36.0625 44.9375 36.7083 45.9792C37.0416 46.5625 37.4791 47.0833 37.9791 47.5208C39.2291 48.6666 40.8333 49.2917 42.5 49.2917C44.8541 49.2917 47.0833 48.0417 48.2916 46.0209C48.6458 45.4375 48.9166 44.7709 49.0624 44.1251C49.2083 43.5834 49.2708 43.0625 49.2708 42.5209C49.2708 40.8542 48.6458 39.2501 47.5208 38.0001C46.2708 36.5417 44.4375 35.7292 42.5 35.7292Z"
        fill="#FD6A6A"
      />
      <path
        d="M40.2497 46.2498C39.8538 46.2498 39.458 46.104 39.1455 45.7915C38.5413 45.1873 38.5413 44.1874 39.1455 43.5832L43.5413 39.1873C44.1455 38.5831 45.1455 38.5831 45.7496 39.1873C46.3538 39.7914 46.3538 40.7914 45.7496 41.3956L41.3538 45.7915C41.0413 46.104 40.6455 46.2498 40.2497 46.2498Z"
        fill="#FD6A6A"
      />
      <path
        d="M44.7086 46.2915C44.3128 46.2915 43.9169 46.1456 43.6044 45.8331L39.2086 41.4373C38.6045 40.8331 38.6045 39.8331 39.2086 39.2289C39.8128 38.6248 40.8128 38.6248 41.4169 39.2289L45.8127 43.6247C46.4169 44.2289 46.4169 45.2289 45.8127 45.8331C45.5002 46.1456 45.1044 46.2915 44.7086 46.2915Z"
        fill="#FD6A6A"
      />
    </svg>
  ),
  twitter: Twitter,
  check: Check
}
