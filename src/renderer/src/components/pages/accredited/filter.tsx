import { Button } from '../../ui/button' // Replace with your actual button component
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../ui/drawer' // Replace with your actual drawer component
import CheckboxWithLabel from '@renderer/components/CheckboxWithLabel'
import { SlidersHorizontal } from 'lucide-react'
import { Select } from '@radix-ui/react-select'
import {
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { useAuthHeader } from 'react-auth-kit'
import { AccreditedInfo, Square } from '@renderer/types'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'

const FilterDrawer = () => {
  const authToken = useAuthHeader()
  const { data: Accrediteds } = useQuery({
    queryKey: ['Accredited'],
    queryFn: () =>
      getApi<AccreditedInfo[]>('/accredited', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const { data: squares } = useQuery({
    queryKey: ['square'],
    queryFn: () =>
      getApi<Square[]>('/square', {
        headers: {
          Authorization: authToken()
        }
      })
  })


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
              <label className="pr-4 font-bold text-[#414141] ">حسب الدكتور</label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="اختر الدكتور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الدكاتره</SelectLabel>
                    {Accrediteds?.data.map((statuse) => (
                      <SelectItem key={statuse.doctor} value={statuse.doctor}>
                        {statuse.doctor}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[279.35px]  border-b-[1px] border-[#F0F1F5]  pb-5">
              <label className="pr-4 font-bold text-[#414141] ">حسب الموقع</label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="اختر الموقع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الموقع</SelectLabel>
                    {Accrediteds?.data.map((statuse) => (
                      <SelectItem key={statuse.treatmentSite} value={statuse.treatmentSite}>
                        {statuse.treatmentSite}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="w-[279.35px]  border-b-[1px] border-[#F0F1F5]  pb-5">
              <label className="pr-4 font-bold text-[#414141] ">حسب الحالة</label>
              <Select>
                <SelectTrigger className="">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الحالات</SelectLabel>
                    {Accrediteds?.data.map((statuse) => (
                      <SelectItem key={statuse.state} value={statuse.state}>
                        {statuse.state}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <label className="text-black font-bold pr-6">حسب المربعات</label>
          <div className="grid grid-cols-3 px-7 ">
            {squares?.data.map((square) => (
              <div key={square.name} className="col-span-1 mt-3">
                <CheckboxWithLabel label={square.name} />
              </div>
            ))}
          </div>
        </form>

        <DrawerFooter className="flex justify-between p-4">
          <div className="flex justify-between">
            <Button className="bg-[#196CB0]">فلتر</Button>
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
