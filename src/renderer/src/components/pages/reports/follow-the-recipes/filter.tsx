import { useEffect, useState } from 'react'
import { Button } from '../../../ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from '../../../ui/drawer'
import { SlidersHorizontal, X } from 'lucide-react'
import { Separator } from '@radix-ui/react-separator'
import { getApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { DiseasesResponses, Directorate } from '@renderer/types'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
// export interface Directorate {
//   id: number
//   globalId: string
//   governorateGlobalId?: string
//   name: string
//   deleted: boolean
//   version: number
//   lastModified: Date
//   Governorate?: Directorate
// }
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
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const [states] = useState([
    { value: 'مستمر', label: 'مستمر' },
    { value: 'موقف', label: 'موقف' },
    { value: 'منتهي', label: 'منتهي' }
  ])
  const [selectedGovernorates, setSelectedGovernorates] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedGender, setSelectedGender] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [selectedDisease, setSelectedDisease] = useState<string[]>([])
  const [selectedDirectorate, setSelectedDirectorate] = useState<string[]>([])

  const {
    data: disease,
    isPending: isdiseasePending,
    error: diseaseeError
  } = useQuery({
    queryKey: ['disease'],
    queryFn: () =>
      getApi<DiseasesResponses[]>('/disease', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const {
    data: directorates,
    isPending: isDirectoratesPending,
    error: directoratesError
  } = useQuery({
    queryKey: ['directorate'],
    queryFn: () =>
      getApi<Directorate[]>('/directorate', {
        headers: {
          Authorization: authToken()
        }
      })
  })
  const uniqueDisaseNames = Array.from(new Set(disease?.data.map((disease) => disease.name)))
  const uniqueDirectorates = Array.from(
    new Set(directorates?.data.map((directorates) => directorates.name))
  )
  useEffect(() => {
    const governorates = searchParams.getAll('directorateGlobalId')
    const categories = searchParams.getAll('categoryGlobalId')
    const state = searchParams.get('state') || ''
    const gender = searchParams.get('gender') || ''
    const name = searchParams.get('name') || ''
    const diseases = searchParams.getAll('diseaseId')
    const directorate = searchParams.getAll('directorateGlobalId')

    setSelectedGovernorates(governorates)
    setSelectedCategories(categories)
    setSelectedState(state)
    setSelectedGender(gender)
    setName(name)
    setSelectedDisease(diseases)
    setSelectedDirectorate(directorate)
  }, [searchParams])

  const handleDirectorateCheckboxChange = (squareName: string) => {
    setSelectedDirectorate((prev) =>
      prev.includes(squareName) ? prev.filter((name) => name !== squareName) : [...prev, squareName]
    )
  }
  const handleDisasesCheckboxChange = (diseases: string) => {
    setSelectedDisease((prev) =>
      prev.includes(diseases) ? prev.filter((name) => name !== diseases) : [...prev, diseases]
    )
  }
  const handleStateChange = (state: string) => {
    setSelectedState(state)
  }
  const handleClearFilters = () => {
    navigate('/Reports', { replace: true })
  }
  const handleFilter = () => {
    const params = new URLSearchParams()

    selectedGovernorates.forEach((id) => params.append('directorateGlobalId', id))
    selectedCategories.forEach((id) => params.append('categoryGlobalId', id))

    if (selectedState) {
      params.set('state[contains]', selectedState)
    }

    if (selectedGender) {
      params.set('Accredited[applicant][gender][contains]', selectedGender)
    }
    if (name) {
      params.set('Accredited[applicant][name][contains]', name)
    }
    selectedDirectorate.forEach((id) => params.append('applicant[directorate][name][contains]', id))
    selectedDisease.forEach((id) =>
      params.append('applicant[diseasesApplicants][some][Disease][name][contains]', id)
    )

    navigate(`/Reports?${params.toString()}`, { replace: true })
  }
  if (isDirectoratesPending || isdiseasePending) return 'Loading...'
  if (diseaseeError || directoratesError)
    return 'An error has occurred: ' + (diseaseeError?.message || directoratesError?.message)

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
          <div className="w-full h-[1px] bg-[#F0F1F5]"></div>
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">حسب المرض</h3>
            <div className="grid grid-cols-3 gap-4">
              {uniqueDisaseNames.map((name) => (
                <div key={name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={name}
                    checked={selectedDisease.includes(name)}
                    onChange={() => handleDisasesCheckboxChange(name)}
                    className="ml-2"
                  />
                  <label
                    className="text-sm truncate"
                    dir="rtl"
                    style={{ maxWidth: '120px' }}
                    title={name}
                  >
                    {name}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full h-[1px] bg-[#F0F1F5]"></div>
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">حسب المنطقة</h3>
            <div className="grid grid-cols-3 gap-4">
              {uniqueDirectorates.map((name) => (
                <div key={name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={name}
                    checked={selectedDirectorate.includes(name)}
                    onChange={() => handleDirectorateCheckboxChange(name)}
                    className="ml-2"
                  />
                  <label
                    className="text-sm truncate"
                    dir="rtl"
                    style={{ maxWidth: '120px' }}
                    title={name}
                  >
                    {name}
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
