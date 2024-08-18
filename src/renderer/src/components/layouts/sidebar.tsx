import { cn } from '@renderer/lib/utils'
import { useEffect, useState } from 'react'
import logo from '../../assets/images/مؤسسة التنمية الصحية 2.png'
import useNavItems from '../../hooks/useNavItems'
import useScreenSize from '../../hooks/useScreenSize'
import SidebarToggleIcon from '../icons/sidebar-toggler-icon'
import { Separator } from '../ui/separator'
import DashboardNav from './dashboard-nav'

export default function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const navItems = useNavItems()
  const screenSize = useScreenSize()
  const width = screenSize.width

  useEffect(() => {
    if (width <= 940) {
      setExpanded(false)
    } else {
      setExpanded(true)
    }
  }, [width])

  return (
    <aside
      className={cn(
        'relative z-50  flex h-[100vh] shrink-0 flex-col rounded-none  border bg-background  shadow-xl   transition-all ease-in-out',
        expanded ? 'w-[270px]' : 'w-24'
      )}
    >
      <SidebarToggleIcon expanded={expanded} setExpanded={setExpanded} />

      <div className={cn('flex w-full flex-col items-center justify-center p-4 gap-2', {})}>
        {expanded ? (
          <img src={logo} alt="logo" className="w-[110px] h-[79px]" />
        ) : (
          <img src={logo} alt="logo" className="w-[62px] h-[62px]" />
        )}

        <Separator className="mt-6 " />
      </div>

      <div className="flex-grow overflow-y-auto py-4 hide-scrollbar">
        <DashboardNav items={navItems} expanded={expanded} />
      </div>
    </aside>
  )
}
