import { NavItem } from '../types/index'


export default function useNavItemsSetting() {

  const navItems: NavItem[] = [
    {
      list: [
              {
          href: '/logout',
          icon: 'LogOut',
          label: 'تسجيل الخروج'

        }
      ]
    }
  ]
  return navItems
}
