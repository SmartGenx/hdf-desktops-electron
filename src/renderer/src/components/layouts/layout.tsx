import { Outlet } from 'react-router-dom'
import { Toaster } from '../ui/toaster'
import Header from './header'
import Sidebar from './sidebar'

const RootLayout = () => {
  return (
    <>
      <div className="flex h-screen overflow-hidden bg-muted">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <div className="flex flex-auto flex-col overflow-y-auto">
          <Header />
          <main className="p-6 bg-[#f3f4f8] ">
            <Outlet />
            <Toaster />
          </main>
        </div>
      </div>
    </>
  )
}

export default RootLayout
