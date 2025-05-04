import Boutton from '@renderer/components/Boutton'
import { useSearchParams } from 'react-router-dom'
import FilterDrawer from './filter'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { applicantsReportCategory, applicantsReportCategoryInfo, Print } from '@renderer/types'
import { getApi } from '@renderer/lib/http'
import WaitingTable from './waitingTable'
import ReactToPrint from 'react-to-print'
import ComponentToPrint from './ComponentToPrint'
import { LoaderIcon, Printer } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import WaitingSearch from './waiting-search'

export default function WaitingList() {
  const [searchParams] = useSearchParams()
  const [dataPrint, setDataPrint] = useState<Print[] | any[]>([])
  const page = searchParams.get('page')
  const query = searchParams.get('query')
  const directorate = searchParams.get('directorate[name][contains]')
  const dieases = searchParams.get('diseasesApplicants[some][Disease][name]')
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    isError,
    data: applicantsReportCategory
  } = useQuery({
    queryKey: ['applicantsReportCategory', page, directorate, dieases],
    queryFn: () =>
      getApi<applicantsReportCategoryInfo>('/applicant/applicantsReportCategory', {
        params: {
          'name[contains]': query,
          'directorate[name][contains]': directorate,
          'diseasesApplicants[some][Disease][name]': dieases,
          page: page || 1,
          pageSize: 10
        },
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
    queryKey: ['applicantsReportCategoryCard', directorate, dieases],
    queryFn: () =>
      getApi<applicantsReportCategory[]>('/applicant/applicantsReportCategory', {
        params: {
          'name[contains]': query,
          'directorate[name][contains]': directorate,
          'diseasesApplicants[some][Disease][name]': dieases
        },
        headers: {
          Authorization: authToken()
        }
      })
  })

  useEffect(() => {
    if (applicantsReportCategoryPrint?.data) {
      const dataToExport = applicantsReportCategoryPrint?.data.map((item) => {
        return {
          الأسم: item.name,
          'تصنيف المرض': item.disease,
          المنطقة: item.directorate,
          الجوال: item.phoneNumber,
          'تاريخ التقديم': item.submissionDate,
          فئة: item.category
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

  if (isPending && isPeningCardCard)
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  if (isError && isErrorCard) return 'An error has occurred: ' + error.message
  return (
    <>
      <div className="flex  gap-5 mt-[20px] items-center justify-between  mb-7 ">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">جدول قائمة الأنتظار</h1>
        </div>
        <div className="flex gap-2">
          <WaitingSearch />
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
            icon="exportscvs"
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
