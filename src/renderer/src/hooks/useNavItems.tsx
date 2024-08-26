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
          href: '/applicants',
          icon: 'user',
          label: 'إدارة المتقدمين'
        },
        {
          href: '/accredited',
          icon: 'accredit',
          label: 'إدارة الاعتماد'
        }
      ]
    },

    {
      title: 'الصرف',
      list: [

        {
          href: '/knowledge',
          icon: 'dismiss',
          label: 'إدارة الصرف'
        },
       
      ]
    }
  ]
  return navItems
}
