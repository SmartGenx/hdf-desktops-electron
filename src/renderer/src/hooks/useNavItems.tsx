import { NavItem } from '../types/index'

export default function useNavItems() {
  const navItems: NavItem[] = [
    {
      list: [
        {
          href: '/',
          icon: 'category',
          label: ' الصفحة الرئيسية'
        },

        {
          href: '',
          icon: 'idCard',
          label: 'ادارة المستخدمين',
          type: 'group',
          subLinks: [
            {
              label: 'المستخدمين',
              href: '/users'
            },
            {
              label: 'الموطفين',
              href: '/employees',
              disabled: true
            },
            {
              label: 'ضبط كلمة المرور',
              href: '/reset-password',
              disabled: true
            }
          ]
        },
        {
          href: '/backup',
          icon: 'databaseBackup',
          label: 'النسخ الاحتياطي',
          disabled: true
        }
      ]
    }
  ]
  return navItems
}
