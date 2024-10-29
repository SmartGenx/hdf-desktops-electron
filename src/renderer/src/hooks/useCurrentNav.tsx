import { useLocation } from 'react-router-dom'
import useNavItems from './useNavItems'

export default function useCurrentNav() {
  const location = useLocation()


  const path = location.pathname
 



  const navItems = useNavItems()
 

  const flattenedNavItems = navItems.flatMap((item) => item.list)


  const currentNav = flattenedNavItems.find((item) => {
    
    if (item.subLinks && item.subLinks.length > 0) {
      return item.subLinks.some((subLink) => subLink.href === path)
    }
    if (item.href === '/dashboard') {
      return path === item.href
    }
    return path === item.href
  })

  return currentNav
}
