import { useState } from 'react'
import useCurrentNav from '@renderer/hooks/useCurrentNav'
import { LoaderIcon, MenuIcon, RefreshCcw, X } from 'lucide-react'
import UserNav from './user-nav'
import { useMutation, useQuery } from '@tanstack/react-query'
import { postApi } from '@renderer/lib/http'
import { toast } from '../ui/use-toast'

export default function Header() {
  const currentPath = useCurrentNav()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // الميوتيشن للمزامنة
  const mutation = useMutation({
    mutationFn: () => postApi('/syncProcess', {}),
    onSuccess: () => {
      toast({
        title: 'تمت المزامنة بنجاح',
        description: 'تمت المزامنة بنجاح',
        variant: 'success'
      })
      // إعادة جلب حالة البيانات المعلقة بعد المزامنة
      refetchPendingData()
    },
    onError: (error: any) => {
      toast({
        title: 'فشلت العملية',
        description: error?.message || 'حدث خطأ غير متوقع.',
        variant: 'destructive'
      })
      console.error('Error during synchronization:', error.message)
    }
  })

  // الاستعلام للتحقق من وجود بيانات معلقة
  const {
    data: pendingData,
    isLoading: isPendingDataLoading,
    refetch: refetchPendingData
  } = useQuery({
    queryKey: ['pendingSyncData'],
    queryFn: () => fetch('/api/syncProcess').then(res => res.json()),
    refetchInterval: 5000, // اختياري: إعادة الجلب كل 5 ثوانٍ لتحديث الحالة
  })

  function onSubmit() {
    mutation.mutate()
  }

  return (
    <>
      <div className="top-6 z-20 shadow-lg border bg-background">
        <nav className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center sm:hidden">
            <button className="text-xl focus:outline-none " onClick={toggleSidebar}>
              {sidebarOpen ? <X /> : <MenuIcon />}
            </button>
            <h1 className="mr-3 text-lg font-bold md:text-xl">{currentPath?.label}</h1>
          </div>

          <div className="hidden items-center sm:flex gap-1">
            <h1 className="text-xl font-bold">{currentPath?.label}</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="bg-[#8ebdff] text-white hover:text-black cursor-pointer p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={onSubmit}
              disabled={!pendingData?.hasPendingData || isPendingDataLoading}
            >
              {mutation.isPending ? (
                <LoaderIcon className="animate-spin duration-1000" />
              ) : (
                <>
                  <RefreshCcw />
                </>
              )}
            </button>
            <UserNav />
          </div>
        </nav>
        <div className="mb-2 px-4"></div>
      </div>
    </>
  )
}
