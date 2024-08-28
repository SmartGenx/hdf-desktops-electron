import { NavItem } from '../types/index'

export default function useNavItems() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/',
          icon: 'dashboard',
          label: 'الصفحة الرئيسية'
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
          disabled: false
        },
        {
          href: '/accredited',
          icon: 'accredit',
          label: 'إدارة الاعتماد',
          disabled: false
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
          disabled: false
        },

      ]
    },
    {
      title: 'التقارير ',
      list: [

        {
          href: '/knowledge',
          icon: 'report',
          label: 'التقارير ',
          disabled: true
        },

      ]
    },
    {
      title: 'الأعدادات ',
      list: [

        {
          href: '/knowledge',
          icon: 'settings',
          label: 'إدارة المستخدمين ',
          disabled: true
        },
        {
          href: '/Initialization',
          icon: 'report',
          label: 'تهيئة النظام',
          disabled: false
        },

      ]
    }
  ]
  return navItems
}
