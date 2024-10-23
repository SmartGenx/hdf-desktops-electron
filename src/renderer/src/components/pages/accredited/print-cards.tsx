import { forwardRef } from 'react'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import Barcode from 'react-barcode'
import { useAuthHeader } from 'react-auth-kit'
import logo from '../../../assets/images/newlogo.svg'

export interface OpenBankStepOne {
  number: number
  formNumber:number
}

const A4Layout = forwardRef<HTMLDivElement>((_props, ref) => {
  const authToken = useAuthHeader()
  const { data: Cards } = useQuery({
    queryKey: ['AccreditedCard'],
    queryFn: () =>
      getApi<OpenBankStepOne[]>('/accredited/card', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  return (
    <div ref={ref} className="w-[210mm] h-[297mm] p-5 mx-auto">
      {/* Updated grid classes */}
      <div className="grid grid-cols-3 grid-rows-4 gap-4">
        {Cards?.data
          .slice(0, 12)
          .map((data, index) => (
            <Card key={index} value={data.number} formNumber={data.formNumber} />
          ))}
      </div>
    </div>
  )
})

export default A4Layout

const Card = ({ value,formNumber }) => {
  return (
    <div className="bg-white border min-h-44 border-gray-300 p-4 flex flex-col items-center justify-center">
      <div className="flex justify-between w-full font-black">
        <div className="w-1/2">
          <img src={logo} alt="logo" className="w-[50%]" />
        </div>
        <div className="w-[100%] text-center">
          <h1 className="text-xs">مؤسسة التنمية الصحية</h1>
          <h1 className="text-xs">HEALTH DEVELOPMENT FOUNDATION</h1>
        </div>
      </div>
      <h1 className="my-1 text-center font-bold">مشروع مساعدة المرضى </h1>
      <h1 className="my-1">رقم الاستمارة : {formNumber}</h1>
      <Barcode value={value} displayValue={false} fontSize={20} height={30} />
    </div>
  )
}
