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
      title: 'العاملين',
      list: [
        {
          href: '/jhj',
          icon: 'user',
          label: 'إدارة المتقدمين'
        },
        {
          href: '/accreditation',
          icon: 'accredit',
          label: 'إدارة الاعتماد'
        }
      ]
    },
    {
      title: 'المرضى',
      list: [
        {
          href: '/beneficiaries',
          icon: 'user',
          label: 'إدارة المستفيدين'
        },
        {
          href: '/knowledge',
          icon: 'dismiss',
          label: 'إدارة الصرف'
        },
        {
          href: '/reports',
          icon: 'Statistics',
          label: 'الإحصاءات والتقارير'
        }
      ]
    }
  ]
  return navItems
}
