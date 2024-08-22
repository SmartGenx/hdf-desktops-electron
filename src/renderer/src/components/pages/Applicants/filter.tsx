import React, { useState } from 'react'
import { Checkbox } from '../../ui/checkbox' // Replace with your actual checkbox component if using ShadCN
import { Button } from '../../ui/button' // Replace with your actual button component
import { Calendar } from '../../ui/calendar' // Replace with your actual calendar component
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
import { Separator } from '@radix-ui/react-separator'

const FilterDrawer = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [clan, setclan] = React.useState<boolean>(false)

  const handleDateChange = (range) => {
    // setSelectedDateRange(range)
  }

  return (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline" className="border-[#434749]">
          <SlidersHorizontal fill="#434749" stroke="#434749" />
          <span className="px-1">فلترة</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="w-fit max-w-sm bg-white">
        <DrawerHeader className="flex justify-between p-4">
          <DrawerTitle className="text-lg font-bold">فلترة</DrawerTitle>
          <DrawerClose>
            <X className="w-5 h-5 text-gray-600" />
          </DrawerClose>
        </DrawerHeader>
        <Separator />

        <div className="p-6 overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">حسب المحافظة</h3>
            <div className="grid grid-cols-3 gap-2">
              <CheckboxWithLabel label="الكل" />
              <CheckboxWithLabel label="حضرموت" />
              <CheckboxWithLabel label="شبوة" />
              <CheckboxWithLabel label="المهرة" />
              <CheckboxWithLabel label="أبين" />
              <CheckboxWithLabel label="عدن" />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">حسب المربعات</h3>
            <div className="grid grid-cols-3 gap-2">
              <CheckboxWithLabel label="الكل" />
              <CheckboxWithLabel label="حضرموت" />
              <CheckboxWithLabel label="شبوة" />
              <CheckboxWithLabel label="متوب" />
              <CheckboxWithLabel label="غصمي" />
              <CheckboxWithLabel label="الضالع" />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <CheckboxWithLabel label="تحديد الفترة" />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button className="bg-blue-600 text-white " onClick={() => setclan(!clan)}>
                من
              </Button>
              <Button className="bg-blue-600 text-white" onClick={() => setclan(!clan)}>
                إلى
              </Button>
            </div>
            {clan ? (
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border "
              />
            ) : null}
          </div>
        </div>

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
