import Boutton from '@renderer/components/Boutton'
import SearchInput from '@renderer/components/searchInput'
import {  useSearchParams } from 'react-router-dom'
import FilterDrawer from './filter'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { applicantsReportCategory, applicantsReportCategoryInfo, Print } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import WaitingTable from './waitingTable'
import ReactToPrint from 'react-to-print'
import ComponentToPrint from './ComponentToPrint'
import { Printer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'

export default function WaitingList() {
  const [searchParams] = useSearchParams()
  const [dataPrint, setDataPrint] = useState<Print[] | any[]>([])
  const page = searchParams.get('page')
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    isError,
    data: applicantsReportCategory
  } = useQuery({
    queryKey: ['applicantsReportCategory', page],
    queryFn: () =>
      getApi<applicantsReportCategoryInfo>('/applicant/applicantsReportCategory', {
        params: { page: page || 1, pageSize: 5 },
        headers: {
          Authorization: authToken()
        }
      })
  })

  const {
    isPending: isPeningCardCard,
    isError: isErrorCard,
    error: _errorCard,
    data: applicantsReportCategoryPrint
  } = useQuery({
    queryKey: ['applicantsReportCategoryCard'],
    queryFn: () =>
      getApi<applicantsReportCategory[]>('/applicant/applicantsReportCategory', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  // const dataToExport = applicantsReportCategoryPrint?.data.map((item) => ({
  //   "الأسم": item.name,
  //   'تصنيف المرض': item.disease,
  //   "المنطقة": item.directorate,
  //   "الجوال": item.phoneNumber,
  //   'تاريخ التقديم': item.submissionDate,
  //   "فئة": item.category
  // }))
  useEffect(() => {
    if (applicantsReportCategoryPrint?.data) {
      const dataToExport = applicantsReportCategoryPrint?.data.map((item) => {
        return {
          "الأسم": item.name,
          'تصنيف المرض': item.disease,
          "المنطقة": item.directorate,
          "الجوال": item.phoneNumber,
          'تاريخ التقديم': item.submissionDate,
          "فئة": item.category
        }
      })

      setDataPrint(dataToExport)
    }
  }, [applicantsReportCategoryPrint])
  // 
  const ExportCvs = () => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dataPrint)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const fileName = 'تصدير قائمة الانتظار.xlsx'
    XLSX.writeFile(workbook, fileName)
  }
  const componentRef = useRef<HTMLTableElement>(null)

  if (isPending && isPeningCardCard) return 'Loading...'
  if (isError && isErrorCard) return 'An error has occurred: ' + error.message
  return (
    <>
      <div className="flex  gap-5 mt-[20px] items-center justify-between  mb-7 ">
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
            <ComponentToPrint ref={componentRef} data={applicantsReportCategoryPrint?.data || []} />
          </div>

          <Boutton
            icon="addaccredited"
            title={'تصدير'}
            className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709]"
            onClick={ExportCvs}
          />
        </div>
      </div>
      <WaitingTable
        info={applicantsReportCategory?.data.info || []}
        page={applicantsReportCategory?.data.page || '1'}
        pageSize={applicantsReportCategory?.data.pageSize || '5'}
        total={applicantsReportCategory?.data.total || 10}
      />
    </>
  )
}
