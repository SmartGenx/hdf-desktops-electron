import React, { useEffect, useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'

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
  const [states] = useState([
    { value: 'active', label: 'نشط' },
    { value: 'not active', label: 'غير نشط' }
  ])
  const [gender] = useState([
    { value: 'M', label: 'ذكر' },
    { value: 'F', label: 'انثى' }
  ])
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  const [clan, setClan] = React.useState<boolean>(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  // const selectedGovernorates = searchParams.getAll('directorateGlobalId')
  // const selectedCategories = searchParams.getAll('categoryGlobalId')
  const [selectedGovernorates, setSelectedGovernorates] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedGender, setSelectedGender] = useState<string>('')
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

  useEffect(() => {
    const governorates = searchParams.getAll('directorateGlobalId')
    const categories = searchParams.getAll('categoryGlobalId')
    const state = searchParams.get('state') || ''
    const gender = searchParams.get('gender') || ''

    setSelectedGovernorates(governorates)
    setSelectedCategories(categories)
    setSelectedState(state)
    setSelectedGender(gender)
  }, [searchParams])

  // const handleGovernorateCheckboxChange = (globalId: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   const governorates = params.getAll('directorateGlobalId')

  //   if (governorates.includes(globalId)) {
  //     // If already selected, remove it
  //     params.delete('directorateGlobalId')
  //     governorates
  //       .filter((id) => id !== globalId)
  //       .forEach((id) => params.append('directorateGlobalId', id))
  //   } else {
  //     // Add new selection
  //     params.append('directorateGlobalId', globalId)
  //   }
  //   navigate(`/applicants?${params.toString()}`, { replace: true })
  // }

  // const handleCategoryCheckboxChange = (globalId: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   const categories = params.getAll('categoryGlobalId')

  //   if (categories.includes(globalId)) {
  //     // If already selected, remove it
  //     params.delete('categoryGlobalId')
  //     categories
  //       .filter((id) => id !== globalId)
  //       .forEach((id) => params.append('categoryGlobalId', id))
  //   } else {
  //     // Add new selection
  //     params.append('categoryGlobalId', globalId)
  //   }
  //   navigate(`/applicants?${params.toString()}`, { replace: true })
  // }

  // const handleStateChange = (state: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('state', state)

  //   navigate(`/applicants?${params.toString()}`, { replace: true })
  // }

  // const handleGenderChange = (gender: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('gender', gender)

  //   navigate(`/applicants?${params.toString()}`, { replace: true })
  // }
  const handleGovernorateChange = (globalId: string) => {
    setSelectedGovernorates((prev) =>
      prev.includes(globalId) ? prev.filter((id) => id !== globalId) : [...prev, globalId]
    )
  }

  const handleCategoryChange = (globalId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(globalId) ? prev.filter((id) => id !== globalId) : [...prev, globalId]
    )
  }

  const handleStateChange = (state: string) => {
    setSelectedState(state)
  }

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender)
  }
  const handleClearFilters = () => {
    navigate('/applicants', { replace: true })
  }
  const handleFilter = () => {
    const params = new URLSearchParams()

    selectedGovernorates.forEach((id) => params.append('directorateGlobalId', id))
    selectedCategories.forEach((id) => params.append('categoryGlobalId', id))

    if (selectedState) {
      params.set('state', selectedState)
    }

    if (selectedGender) {
      params.set('gender', selectedGender)
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
          {/* Governorates Filter */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">حسب المحافظة</h3>
            <div className="grid grid-cols-3 gap-4">
              {governorateData?.data.map((governorate) => (
                <div key={governorate.globalId} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={governorate.globalId}
                    checked={selectedGovernorates.includes(governorate.globalId)}
                    onChange={() => handleGovernorateChange(governorate.globalId)}
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
                    onChange={() => handleCategoryChange(category.globalId)}
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

          <div className="w-[279.35px] border-b-[1px] border-[#F0F1F5] pb-5">
            {/* State Filter */}
            <label className="pr-4 font-bold text-[#414141]">اختار الحالة</label>
            <Select value={selectedState} onValueChange={handleStateChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختار الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الحالة</SelectLabel>
                  {states.map((state) => (
                    <SelectItem key={state.value} value={state.value}>
                      {state.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-[279.35px] border-b-[1px] border-[#F0F1F5] pb-5">
            {/* Gender Filter */}
            <label className="pr-4 font-bold text-[#414141]">اختار الجنس</label>
            <Select value={selectedGender} onValueChange={handleGenderChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختار الجنس" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>الجنس</SelectLabel>
                  {gender.map((gender) => (
                    <SelectItem key={gender.value} value={gender.value}>
                      {gender.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full h-[1px] bg-[#F0F1F5]"></div>
          <div className="mb-6 mt-3">
            <div className="flex items-center mb-4">
              <CheckboxWithLabel label="تحديد الفترة" />
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button className="bg-blue-600 text-white " onClick={() => setClan(!clan)}>
                من
              </Button>
              <Button className="bg-blue-600 text-white" onClick={() => setClan(!clan)}>
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
          <div className="flex justify-between gap-2">
            {/* 'إلغاء' button wrapped with DrawerClose */}
            <DrawerClose asChild>
              <Button variant="outline">إلغاء</Button>
            </DrawerClose>
            {/* 'إعادة تعيين' button to clear filters */}
            <Button variant="outline" onClick={handleClearFilters}>
              إعادة تعيين
            </Button>
            {/* 'فلتر' button */}
            <Button className="bg-[#196CB0]" onClick={handleFilter}>
              فلتر
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default FilterDrawer
