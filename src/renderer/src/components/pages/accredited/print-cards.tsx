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
      <img src={logo} alt="" className="mb-5" />
      <Barcode value={value} />
    </div>
  )
}
