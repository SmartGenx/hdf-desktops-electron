import { useState } from 'react'
// import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import useCurrentNav from '@renderer/hooks/useCurrentNav'
import { LoaderIcon, MenuIcon, RefreshCcw, X } from 'lucide-react'
import UserNav from './user-nav'
import { useMutation } from '@tanstack/react-query'
import { postApi } from '@renderer/lib/http'
import { toast } from '../ui/use-toast'

export default function Header() {
  const currentPath = useCurrentNav()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }
  const mutation = useMutation({
    mutationFn: () => postApi('/syncProcess', {}),
    onSuccess: () => {
      toast({
        title: 'تمت المزامنه بنجاح',
        description: 'تم المزامنه بنجاح',
        variant: 'success'
      })
    },
    onError: (error: any) => {
      toast({
        title: 'فشلت العملية',
        description: error?.message || 'حدث خطأ غير متوقع.',
        variant: 'destructive'
      })
      console.error('Error adding governorate:', error.message)
    }
  })
  function onSubmit() {
    mutation.mutate();
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
            <span className="bg-[#8ebdff] text-white hover:text-black cursor-pointer p-2 rounded-lg" onClick={onSubmit}>
              {mutation.isPending ? (
                <LoaderIcon className="animate-spin duration-1000" />
              ) : (
                <>
                  <RefreshCcw />
                </>
              )}
            </span>
            <UserNav />
          </div>
        </nav>
        <div className="mb-2 px-4"></div>
      </div>

      {/* {sidebarOpen && <MobileSidebar isOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />} */}
    </>
  )
}
