import React, { useState } from 'react'
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
import { getApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
export interface Directorate {
  id: number
  globalId: string
  governorateGlobalId?: string
  name: string
  deleted: boolean
  version: number
  lastModified: Date
  Governorate?: Directorate
}
export interface Category {
  id: number
  globalId: string
  name: string
  SupportRatio: number
  deleted: boolean
  description: string
  version: number
  lastModified: Date
}
const FilterDrawer = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [clan, setclan] = React.useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const selectedGovernorates = searchParams.getAll('directorateGlobalId')
  const selectedCategories = searchParams.getAll('categoryGlobalId')
  const pathname = location.pathname

  const {
    isPending: isdirectoratePending,
    error: directorateError,
    data: governorateData
  } = useQuery({
    queryKey: ['directorate'],
    queryFn: () =>
      getApi<Directorate[]>('/directorate', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const {
    isPending: isCategoryPending,
    error: categoryError,
    data: categoryData
  } = useQuery({
    queryKey: ['category'],
    queryFn: () =>
      getApi<Category[]>('/category', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  const handleGovernorateCheckboxChange = (globalId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const governorates = params.getAll('directorateGlobalId')

    if (governorates.includes(globalId)) {
      // If already selected, remove it
      params.delete('directorateGlobalId')
      governorates
        .filter((id) => id !== globalId)
        .forEach((id) => params.append('directorateGlobalId', id))
    } else {
      // Add new selection
      params.append('directorateGlobalId', globalId)
    }
    navigate(`/applicants?${params.toString()}`, { replace: true })
  }

  const handleCategoryCheckboxChange = (globalId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const categories = params.getAll('categoryGlobalId')

    if (categories.includes(globalId)) {
      // If already selected, remove it
      params.delete('categoryGlobalId')
      categories
        .filter((id) => id !== globalId)
        .forEach((id) => params.append('categoryGlobalId', id))
    } else {
      // Add new selection
      params.append('categoryGlobalId', globalId)
    }
    navigate(`/applicants?${params.toString()}`, { replace: true })
  }

  const handleSubmit = () => {
    const params = new URLSearchParams(searchParams.toString())

    // If there's at least one selected category and governorate
    if (selectedCategories.length > 0) {
      console.log('Setting categoryGlobalId:', selectedCategories[0]) // Log what you're setting
      params.set('categoryGlobalId', selectedCategories[0])
    } else {
      params.delete('categoryGlobalId')
    }

    if (selectedGovernorates.length > 0) {
      console.log('Setting directorateGlobalId:', selectedGovernorates[0]) // Log what you're setting
      params.set('directorateGlobalId', selectedGovernorates[0])
    } else {
      params.delete('directorateGlobalId')
    }

    navigate(`/applicants?${params.toString()}`, { replace: true })
  }

  if (isdirectoratePending || isCategoryPending) return 'Loading...'
  if (directorateError || categoryError)
    return 'An error has occurred: ' + (directorateError?.message || categoryError?.message)

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
            <div className="grid grid-cols-3 gap-4">
              {governorateData?.data.map((governorate) => (
                <div key={governorate.globalId} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={governorate.globalId}
                    checked={selectedGovernorates.includes(governorate.globalId)}
                    onChange={() => handleGovernorateCheckboxChange(governorate.globalId)}
                    className="mr-2"
                  />
                  <label
                    className="text-sm truncate"
                    dir="rtl"
                    style={{ maxWidth: '120px' }}
                    title={governorate.name}
                  >
                    {governorate.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full h-[1px] bg-[#F0F1F5]"></div>
          <div className="mb-6 mt-4">
            <h3 className="text-sm font-medium mb-2">حسب فئة</h3>
            <div className="grid grid-cols-3 gap-4">
              {categoryData?.data.map((category) => (
                <div key={category.globalId} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={category.globalId}
                    checked={selectedCategories.includes(category.globalId)}
                    onChange={() => handleCategoryCheckboxChange(category.globalId)}
                    className="mr-2"
                  />
                  <label
                    className="text-sm truncate"
                    dir="rtl"
                    style={{ maxWidth: '120px' }}
                    title={category.name}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            Submit
          </button>
          <div className="w-full h-[1px] bg-[#F0F1F5]"></div>
          <div className="mb-6 mt-3">
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
