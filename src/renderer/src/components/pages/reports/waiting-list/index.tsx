import Boutton from '@renderer/components/Boutton'
import SearchInput from '@renderer/components/searchInput'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import FilterDrawer from './filter'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { applicantsReportCategory } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import WaitingTable from './waitingTable'
import ReactToPrint from 'react-to-print'
import ComponentToPrint from './ComponentToPrint'
import { Printer } from 'lucide-react'

export default function WaitingList() {
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    data: applicantsReportCategory
  } = useQuery({
    queryKey: ['applicantsReportCategory'],
    queryFn: () =>
      getApi<applicantsReportCategory[]>('/applicant/applicantsReportCategory', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const componentRef = useRef<HTMLTableElement>(null)

  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  return (
    <>
      <div className="flex  gap-5 mt-[85px] items-center justify-between  mb-7">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">جدول قائمة الأنتظار</h1>
        </div>
        <div className="flex gap-2">
          <SearchInput />
          <FilterDrawer />

          <ReactToPrint
            trigger={() => (
              <button className="bg-[#196CB0] flex items-center text-white rounded-lg hover:bg-[#2d5372] px-3 focus:ring-[#2d5372]">
                <Printer className="ml-2" size={20} />
                طباعة
              </button>
            )}
            content={() => componentRef.current}
          />
          <div className="hidden">
            <ComponentToPrint ref={componentRef} data={applicantsReportCategory?.data} />
          </div>

          <Link to={'/formDismissal'}>
            <Boutton
              icon="addaccredited"
              title={'تصدير'}
              className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709]"
            />
          </Link>
        </div>
      </div>
      <WaitingTable data={applicantsReportCategory?.data} />
    </>
  )
}
