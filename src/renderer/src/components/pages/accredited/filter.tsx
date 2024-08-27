import React, { useState } from 'react'
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
import { SlidersHorizontal, X } from 'lucide-react'
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
import { AccreditedInfo } from '@renderer/types'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'

const FilterDrawer = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [clan, setclan] = React.useState<boolean>(false)
  const statuses = [{ value: 'fdfdsfdf', Label: 'fdfdfdfd' }]
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
          </div>
        </form>

        <DrawerFooter className="flex justify-between p-4">
          <div className="flex justify-between">
            <DrawerClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DrawerClose>
            <Button className="bg-[#196CB0]">فلتر</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default FilterDrawer
