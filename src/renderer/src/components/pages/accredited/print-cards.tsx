import { forwardRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import Barcode from 'react-barcode'
import { useAuthHeader } from 'react-auth-kit'
import { getApi } from '@renderer/lib/http'
import logo from '../../../assets/images/newlogo.svg'

export interface OpenBankStepOne {
  number: number
  formNumber: number
}

const chunkArray = <T,>(array: T[] = [], size: number): T[][] =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  )

type CardProps = { value: number; formNumber: number }

const Card = ({ value, formNumber }: CardProps) => (
  <div className="bg-white border min-h-44 border-gray-300 p-4 flex flex-col items-center justify-center">
    <div className="flex justify-between w-full font-black">
      <div className="w-1/2">
        <img src={logo} alt="logo" className="w-[50%]" />
      </div>
      <div className="w-full text-center">
        <h1 className="text-xs">مؤسسة التنمية الصحية</h1>
        <h1 className="text-xs">HEALTH DEVELOPMENT FOUNDATION</h1>
      </div>
    </div>
    <h1 className="my-1 text-center font-bold">مشروع مساعدة المرضى</h1>
    <h1 className="my-1">رقم الاستمارة : {formNumber}</h1>
    <Barcode value={value.toString()} displayValue={false} fontSize={20} height={30} />
  </div>
)

const A4Layout = forwardRef<HTMLDivElement>((_, ref) => {
  const authToken = useAuthHeader()

  const { data = [] } = useQuery({
    queryKey: ['AccreditedCard', 'asc'],
    queryFn: () =>
      getApi<OpenBankStepOne[]>('/accredited/card', {
        params: { 'orderBy[formNumber]': 'asc' },
        headers: { Authorization: authToken() }
      })
  })

  const pages = chunkArray(Array.isArray(data) ? data : data.data, 12)

  return (
    <div ref={ref}>
      {pages.map((pageData, pageIdx) => (
        <div
          key={pageIdx}
          className="w-[210mm] h-[297mm] p-5 mx-auto"
          style={{ pageBreakAfter: pageIdx !== pages.length - 1 ? 'always' : 'auto' }}
        >
          <div className="grid grid-cols-2 grid-rows-4 gap-4">
            {pageData.map((c, idx) => (
              <Card key={idx} value={c.number} formNumber={c.formNumber} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
})

export default A4Layout
