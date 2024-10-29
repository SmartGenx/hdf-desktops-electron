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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@renderer/components/ui/select'
import { FormInput } from '@renderer/components/ui/forms-input'
import { DiseasesResponses, Square } from '@renderer/types'

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
  const [gender] = useState([
    { value: 'M', label: 'ذكر' },
    { value: 'F', label: 'انثى' }
  ])

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  // const selectedGovernorates = searchParams.getAll('directorateGlobalId')
  // const selectedCategories = searchParams.getAll('categoryGlobalId')
  const [selectedGovernorates, setSelectedGovernorates] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [selectedGender, setSelectedGender] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [selectedSquares, setSelectedSquares] = useState<string[]>([])
  const [selectedDisease, setSelectedDisease] = useState<string[]>([])

  const {
    data: squares,
    isPending: issquaresPending,
    error: squaresError
  } = useQuery({
    queryKey: ['square'],
    queryFn: () =>
      getApi<Square[]>('/square', {
        headers: {
          Authorization: authToken()
        }
      })
  })
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

  const uniqueSquareNames = Array.from(new Set(squares?.data.map((square) => square.name)))
  const uniqueDisaseNames = Array.from(new Set(disease?.data.map((disease) => disease.name)))
  useEffect(() => {
    const governorates = searchParams.getAll('directorateGlobalId')
    const categories = searchParams.getAll('categoryGlobalId')
    const state = searchParams.get('state') || ''
    const gender = searchParams.get('gender') || ''
    const name = searchParams.get('name') || ''
    const squares = searchParams.getAll('squareGlobalId')
    const diseases = searchParams.getAll('diseaseId')

    setSelectedGovernorates(governorates)
    setSelectedCategories(categories)
    setSelectedState(state)
    setSelectedGender(gender)
    setName(name)
    setSelectedSquares(squares)
    setSelectedDisease(diseases)
  }, [searchParams])

  // const handleGovernorateChange = (globalId: string) => {
  //   setSelectedGovernorates((prev) =>
  //     prev.includes(globalId) ? prev.filter((id) => id !== globalId) : [...prev, globalId]
  //   )
  // }

  // const handleCategoryChange = (globalId: string) => {
  //   setSelectedCategories((prev) =>
  //     prev.includes(globalId) ? prev.filter((id) => id !== globalId) : [...prev, globalId]
  //   )
  // }
  const handleSquareCheckboxChange = (squareName: string) => {
    setSelectedSquares((prev) =>
      prev.includes(squareName) ? prev.filter((name) => name !== squareName) : [...prev, squareName]
    )
  }

  const handleDisasesCheckboxChange = (diseases: string) => {
    setSelectedDisease((prev) =>
      prev.includes(diseases) ? prev.filter((name) => name !== diseases) : [...prev, diseases]
    )
  }

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender)
  }
  const handleClearFilters = () => {
    navigate('/Reports', { replace: true })
  }
  const handleFilter = () => {
    const params = new URLSearchParams()

    selectedGovernorates.forEach((id) => params.append('directorateGlobalId', id))
    selectedCategories.forEach((id) => params.append('categoryGlobalId', id))

    if (selectedState) {
      params.set('state', selectedState)
    }

    if (selectedGender) {
      params.set('Accredited[applicant][gender][contains]', selectedGender)
    }
    if (name) {
      params.set('Accredited[applicant][name][contains]', name)
    }
    selectedSquares.forEach((id) => params.append('Accredited[square][name]', id))
    selectedDisease.forEach((id) =>
      params.append('Accredited[applicant][diseasesApplicants][some][Disease][name]', id)
    )

    navigate(`/Reports?${params.toString()}`, { replace: true })
  }
  if (issquaresPending || isdiseasePending) return 'Loading...'
  if (diseaseeError || squaresError)
    return 'An error has occurred: ' + (diseaseeError?.message || squaresError?.message)

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
            <h3 className="text-sm font-medium mb-2">اسم المتقدم</h3>
            <div className="grid grid-cols-1 gap-4">
              <FormInput
                type="text"
                placeholder="ادخل اسم المتقدم"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">حسب المربعات</h3>
            <div className="grid grid-cols-3 gap-4">
              {uniqueSquareNames.map((name) => (
                <div key={name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={name}
                    checked={selectedSquares.includes(name)}
                    onChange={() => handleSquareCheckboxChange(name)}
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
