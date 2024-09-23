import { forwardRef } from 'react'
import { getApi } from '@renderer/lib/http'
import { useQuery } from '@tanstack/react-query'
import Barcode from 'react-barcode'
import { useAuthHeader } from 'react-auth-kit'
import logo from '../../../assets/images/newlogo.svg'

export interface OpenBankStepOne {
  number: number
}
const A4LayoutById = forwardRef<HTMLDivElement, { id: string }>((props, ref) => {
  const { id } = props
  const authToken = useAuthHeader()
  const { data: Cards } = useQuery({
    queryKey: ['AccreditedCard', id],
    queryFn: () =>
      getApi<OpenBankStepOne>(`/accredited/card/${id}`, {
        headers: {
          Authorization: authToken()
        }
      })
  })

  return (
    <div ref={ref} className="w-[1191px] h-[794px] mx-auto p-5 bg-white border border-black">
      <div className="grid grid-cols-3 grid-rows-3 gap-4 h-full">
        <Card value={Cards?.data.number} />
      </div>
    </div>
  )
})

export default A4LayoutById
const Card = ({ value }) => {
  return (
    <div className="bg-white border border-gray-300 flex flex-col justify-center items-center p-4">
      <img src={logo} alt="" className="mb-5" />
      <Barcode value={value} />
    </div>
  )
}
