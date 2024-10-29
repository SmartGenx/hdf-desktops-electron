import Boutton from '@renderer/components/Boutton'
import { useSearchParams } from 'react-router-dom'
import FilterDrawer from './filter'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import {
  ApplicantByDirectorateViewModel,
  ApplicantByDirectorateViewModelInfo,
  PrintApplication
} from '@renderer/types'
import MedicalTable from './medicalTable'
import ReactToPrint from 'react-to-print'
import { LoaderIcon, Printer } from 'lucide-react'
import ComponentToPrint from './ComponentToPrint'
import { useEffect, useRef, useState } from 'react'
import * as XLSX from 'xlsx'
import MedicalSearch from './medical-search'

export default function MedicalAllocationsIndex() {
  const [searchParams] = useSearchParams()
  const dieases = searchParams.get('Accredited[applicant][diseasesApplicants][some][Disease][name]')
  const [dataPrint, setDataPrint] = useState<PrintApplication[] | any[]>([])
  const page = searchParams.get('page')
  const query = searchParams.get('query')
  const directorate = searchParams.get('Accredited[applicant][directorate][name][contains]')
  const state = searchParams.get('Accredited[state][contains]')
  const authToken = useAuthHeader()

  const {
    isPending: isPendingViewModel,
    isError: isErrorViewModel,
    error: errorViewModel,
    data: ApplicantByDirectorateViewModelData
  } = useQuery({
    queryKey: ['ApplicantByDirectorateViewModel', page, query, dieases, directorate, state],
    queryFn: () =>
      getApi<ApplicantByDirectorateViewModel>('/applicant/ApplicantByDirectorateViewModel', {
        params: {
          'Accredited[applicant][name][contains]': query,
          'Accredited[applicant][diseasesApplicants][some][Disease][name]': dieases,
          'Accredited[applicant][directorate][name][contains]': directorate,
          'Accredited[state][contains]': state,
          page: page || 1,
          pageSize: 5
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
    data: ApplicantByDirectorateViewModelDataCard
  } = useQuery({
    queryKey: ['ApplicantByDirectorateViewModelCard'],
    queryFn: () =>
      getApi<ApplicantByDirectorateViewModelInfo[]>('/applicant/ApplicantByDirectorateViewModel', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  useEffect(() => {
    if (ApplicantByDirectorateViewModelDataCard?.data) {
      const dataToExport = ApplicantByDirectorateViewModelDataCard?.data.map((item) => {
        return {
          الأسم: item.name,
          '	الجنس': item.gender,
          'تصنيف المرض': item.disease,
          المنطقة: item.directorate,
          الجوال: item.phoneNumber,
          الحاله: item.state,
          'تكلفة العلاج': item.totalAmount,
          'نسبة الخصم': item.supportRatio,
          '	مساهمة المريض': item.approvedAmount
        }
      })

      setDataPrint(dataToExport)
    }
  }, [ApplicantByDirectorateViewModelDataCard])
  //
  const ExportCvs = () => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(dataPrint)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

    const fileName = 'تقرير المخصصات العلاجية.xlsx'
    XLSX.writeFile(workbook, fileName)
  }

  const totalAmountSum = ApplicantByDirectorateViewModelDataCard?.data.reduce(
    (acc, current) => acc + (current.totalAmount || 0),
    0
  )

  const totalApprovedAmount = ApplicantByDirectorateViewModelDataCard?.data.reduce(
    (acc, current) => acc + (current.approvedAmount || 0),
    0
  )

  const componentRef = useRef<HTMLTableElement>(null)
  if (isPendingViewModel && isPeningCardCard)
    return (
      <div className="flex justify-center items-center w-full ">
        <LoaderIcon className="mt-12 flex animate-spin items-center justify-end duration-1000" />
      </div>
    )
  if (isErrorViewModel && isErrorCard) return 'An error has occurred: ' + errorViewModel.message

  return (
    <>
      <div className="flex  gap-5 mt-[20px] items-center justify-between   mb-7">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">جدول المخصصات العلاجية</h1>
        </div>
        <div className="flex gap-2">
          <MedicalSearch />
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
              data={ApplicantByDirectorateViewModelDataCard?.data || []}
            />
          </div>

          <Boutton
            icon="addaccredited"
            title={'تصدير'}
            className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709]"
            onClick={ExportCvs}
          />
        </div>
      </div>

      <MedicalTable
        info={ApplicantByDirectorateViewModelData?.data.info || []}
        page={ApplicantByDirectorateViewModelData?.data.page || '1'}
        pageSize={ApplicantByDirectorateViewModelData?.data.pageSize || '5'}
        total={ApplicantByDirectorateViewModelData?.data.total || 10}
      />

      <div className="flex  gap-5 mt-[20px] items-center justify-between bg-[#E5F0FF] p-2 text-gray-500 rounded-lg  mb-7">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">الاجمالي</h1>
        </div>
        <div className="flex gap-5  ">
          <div>
            <p>اجمالي تكلفة العلاج</p>
            <p>{totalAmountSum}</p>
          </div>

          <div>
            <p>مساهمة المريض</p>
            <p>{totalApprovedAmount}</p>
          </div>
        </div>
      </div>
    </>
  )
}
