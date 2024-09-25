import Boutton from '@renderer/components/Boutton'
import SearchInput from '@renderer/components/searchInput'
import { Link, useSearchParams } from 'react-router-dom'
import FilterDrawer from './filter'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { ApplicantByDirectorateViewModel } from '@renderer/types'
import MedicalTable from './medicalTable'
import ReactToPrint from 'react-to-print'
import { Printer } from 'lucide-react'
import ComponentToPrint from './ComponentToPrint'
import { useRef } from 'react'

export default function MedicalAllocationsIndex() {
  const [searchParams] = useSearchParams()
  const page = searchParams.get('page')
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    data: ApplicantByDirectorateViewModelData
  } = useQuery({
    queryKey: ['ApplicantByDirectorateViewModel', page],
    queryFn: () =>
      getApi<ApplicantByDirectorateViewModel>('/applicant/ApplicantByDirectorateViewModel', {
        params: { page: page || 1, pageSize: 1 },
        headers: {
          Authorization: authToken()
        }
      })
  })

  const componentRef = useRef<HTMLTableElement>(null)
  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  console.log('total', ApplicantByDirectorateViewModelData.data.total)
  return (
    <>
      <div className="flex  gap-5 mt-[85px] items-center justify-between   mb-7">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">جدول المخصصات العلاجية</h1>
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
            <ComponentToPrint
              ref={componentRef}
              data={ApplicantByDirectorateViewModelData.data.info}
            />
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

      <MedicalTable
        info={ApplicantByDirectorateViewModelData.data.info || []}
        page={ApplicantByDirectorateViewModelData.data.page || '1'}
        pageSize={ApplicantByDirectorateViewModelData.data.pageSize || '5'}
        total={ApplicantByDirectorateViewModelData.data.total || 10}
      />
    </>
  )
}
