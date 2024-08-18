import { useLocation } from 'react-router-dom'
import useNavItems from './useNavItems'

export default function useCurrentNav() {
  const location = useLocation()
  // console.log(location)

  const path = location.pathname
  // console.log(path)

  const navItems = useNavItems()
  // console.log(navItems)

  const flattenedNavItems = navItems.flatMap((item) => item.list)
  // console.log(flattenedNavItems)

  const currentNav = flattenedNavItems.find((item) => {
    // console.log(item)
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
