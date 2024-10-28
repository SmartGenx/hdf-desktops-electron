import { NavItem } from '../types/index'

export default function useNavItems() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/',
          icon: 'dashboard',
          label: 'الصفحة الرئيسية',
          roles: ['Admin', 'Coordinator',"Pharmacist"]
        }
      ]
    },
    {
      title: 'المرضى',
      list: [
        {
          href: '/applicants',
          icon: 'user',
          label: 'إدارة المتقدمين',
          disabled: false,
          roles: ['Admin', 'Coordinator']
        },
        {
          href: '/accredited',
          icon: 'accredit',
          label: 'إدارة الاعتماد',
          disabled: false,
          roles: ['Admin', 'Coordinator']
        }
      ]
    },

    {
      title: 'الصرف',
      list: [
        {
          href: '/dismissal',
          icon: 'dismiss',
          label: 'إدارة الصرف',
          disabled: false,
          roles: ['Admin', 'Pharmacist']
        }
      ]
    },
    {
      title: 'التقارير ',
      list: [
        {
          href: '/Reports',
          icon: 'report',
          label: 'التقارير ',
          disabled: false,
          roles: ['Admin', 'Coordinator']
        }
      ]
    },
    {
      title: 'الأعدادات ',
      list: [
        // {
        //   href: '/knowledge',
        //   icon: 'settings',
        //   label: 'إدارة المستخدمين ',
        //   disabled: true,
        //   roles: ['Admin', 'Coordinator']
        // },
        {
          href: '/Initialization',
          icon: 'report',
          label: 'تهيئة النظام',
          disabled: false,
          roles: ['Admin', 'Coordinator']
        },
        {
          href: '/backup',
          icon: 'backup',
          label: 'النسخ الإحتياطي',
          disabled: false,
          roles: ['Admin', 'Coordinator']
        }
      ]
    }
  ]
  return navItems
}
