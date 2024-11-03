import { useState } from 'react'
// import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import useCurrentNav from '@renderer/hooks/useCurrentNav'
import { MenuIcon, X } from 'lucide-react'
import UserNav from './user-nav'

export default function Header() {
  const currentPath = useCurrentNav()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
 
  return (
    <>
      <div className="top-6 z-20  shadow-lg  border bg-background">
        <nav className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center sm:hidden">
            <button className="text-xl focus:outline-none " onClick={toggleSidebar}>
              {sidebarOpen ? <X /> : <MenuIcon />}
            </button>
            <h1 className="mr-3 text-lg font-bold md:text-xl">{currentPath?.label}</h1>
          </div>

          <div className="hidden items-center sm:flex gap-1">
            {/* <DoubleArrowRightIcon /> */}
            <h1 className="text-xl font-bold">{currentPath?.label}</h1>
          </div>

          <div className="flex items-center gap-3">
            {/* <ThemeToggle /> */}
            <UserNav />
          </div>
        </nav>
        <div className="mb-2 px-4"></div>
      </div>

      {/* {sidebarOpen && <MobileSidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} */}
    </>
  )
}
