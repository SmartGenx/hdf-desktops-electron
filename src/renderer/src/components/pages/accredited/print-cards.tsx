import { forwardRef } from 'react'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import Barcode from 'react-barcode'
import { useAuthHeader } from 'react-auth-kit'
import logo from '../../../assets/images/newlogo.svg'

export interface OpenBankStepOne {
  number: number
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
    <div ref={ref} className="w-[1191px] h-[794px] mx-auto p-5 bg-white border border-black">
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
        {Cards?.data.map((data, index) => <Card key={index} value={data.number} />)}
      </div>
    </div>
  )
})

export default A4Layout
const Card = ({ value }) => {
  return (
    <div className="bg-white border border-gray-300 flex flex-col justify-center items-center p-4">
      <div className="w-full flex font-black">
        <div className="basis-[50%]">
          <img src={logo} alt="" className="mb-5" />
        </div>
        <div className="basis-[50%] text-center">
          <h1>مؤسسة التنمية الصحية</h1>
          <h1>HEALTH DEVELOPMENT FOUNDATION</h1>
        </div>
      </div>
      {/*  */}
      <h1 className="my-2">رقم الاستمارة : 1515545</h1>
      <Barcode value={value} displayValue={false} />
    </div>
  )
}
