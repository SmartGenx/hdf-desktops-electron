import { useState } from 'react'
import { Button } from '../../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../ui/drawer'
import { SlidersHorizontal } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { useAuthHeader } from 'react-auth-kit'
import { getApi } from '@renderer/lib/http'
import { Select } from '@renderer/components/ui/select'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { useNavigate, useSearchParams } from 'react-router-dom'

type DisisslesResp = {
  id: number
  globalId: string
  month: string
  year: string
  dateToDay: Date
  state: string
  totalAmount: number
  amountPaid: number
  approvedAmount: number
  openDismissal: boolean
  deleted: boolean
  accreditedGlobalId: string
  version: number
  lastModified: Date
}
const FilterDrawer = () => {
  const [states, _setStates] = useState([
    { value: 'active', label: 'نشط' },
    { value: 'not active', label: 'غير نشط' }
  ])

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const { data: dismissal } = useQuery({
    queryKey: ['dismissal'],
    queryFn: () =>
      getApi<DisisslesResp[]>('/dismissal', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('month', month)

    navigate(`/dismissal?${params.toString()}`, { replace: true })
  }
  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('year', year)

    navigate(`/dismissal?${params.toString()}`, { replace: true })
  }
  const handleStateChange = (state: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('state', state)

    navigate(`/dismissal?${params.toString()}`, { replace: true })
  }
  const handleClearFilters = () => {
    navigate('/dismissal', { replace: true })
  }
  console.log('asdasdasd', dismissal?.data)
  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" className="border-[#434749]">
          <SlidersHorizontal fill="#434749" stroke="#434749" />
          <span className="px-1 ">فلترة</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-[352.94px] max-w-sm bg-white">
        <DrawerHeader className="flex justify-center p-4 ">
          <div className=" font-bold text-xl border-b-2 border-[#DEDEDE] w-full flex justify-center pb-2">
            <DrawerTitle> فلترة</DrawerTitle>
          </div>

          {/* <DrawerClose>
            <X className="w-5 h-5 text-gray-600" />
          </DrawerClose> */}
        </DrawerHeader>

        <form id="formId">
          <div className="w-full  px-8  flex flex-col gap-5">
            <div className="w-[279.35px]  border-b-[1px] border-[#F0F1F5]  pb-5 ">
              <label className="pr-4 font-bold text-[#414141] ">اختار الشهر</label>
              <Select onValueChange={(value) => handleMonthChange(value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="اختار الشهر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الشهر</SelectLabel>

                    <SelectItem key="1" value="1">
                      يناير
                    </SelectItem>
                    <SelectItem key="2" value="2">
                      فبراير
                    </SelectItem>
                    <SelectItem key="3" value="3">
                      مارس
                    </SelectItem>
                    <SelectItem key="4" value="4">
                      أبريل
                    </SelectItem>
                    <SelectItem key="5" value="5">
                      مايو
                    </SelectItem>
                    <SelectItem key="6" value="6">
                      يونيو
                    </SelectItem>
                    <SelectItem key="7" value="7">
                      يوليو
                    </SelectItem>
                    <SelectItem key="8" value="8">
                      أغسطس
                    </SelectItem>
                    <SelectItem key="9" value="9">
                      سبتمبر
                    </SelectItem>
                    <SelectItem key="10" value="10">
                      أكتوبر
                    </SelectItem>
                    <SelectItem key="11" value="11">
                      نوفمبر
                    </SelectItem>
                    <SelectItem key="12" value="12">
                      ديسمبر
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[279.35px]  border-b-[1px] border-[#F0F1F5]  pb-5 ">
              <label className="pr-4 font-bold text-[#414141] ">اختار السنة</label>
              <Select onValueChange={(value) => handleYearChange(value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="اختار السنه" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>السنه</SelectLabel>

                    {[...new Set(dismissal?.data.map((dismissals) => dismissals.year))].map(
                      (year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      )
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[279.35px]  border-b-[1px] border-[#F0F1F5]  pb-5 ">
              <label className="pr-4 font-bold text-[#414141] ">اختار الحالة</label>
              <Select onValueChange={(value) => handleStateChange(value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="اختار الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الحالة</SelectLabel>

                    {states.map((state) => (
                      <SelectItem key={state.value} value={state.label}>
                        {state.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </form>

        <DrawerFooter className="flex justify-between p-4">
          <div className="flex justify-between">
            <Button className="bg-[#196CB0]">فلتر</Button>
            <Button variant="outline" onClick={handleClearFilters}>
              إعادة تعيين
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DrawerClose>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default FilterDrawer
