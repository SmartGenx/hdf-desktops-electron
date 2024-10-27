import { Button } from '../../ui/button' // Replace with your actual button component
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
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const FilterDrawer = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [statuses, _setstatuse] = useState<{ label: string; name: string }[]>([
    { label: 'مستمر', name: 'مستمر' },
    { label: 'موقف', name: 'موقف' }
  ])

  const [selectedDoctor, setSelectedDoctor] = useState<string>('')
  const [selectedTreatmentSite, setSelectedTreatmentSite] = useState<string>('')
  const [selectedStatus, setSelectedStatus] = useState<string>('')
  const [selectedSquares, setSelectedSquares] = useState<string[]>([])
  // const handleDoctorChange = (doctor: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('doctor', doctor)

  //   navigate(`/accredited?${params.toString()}`, { replace: true })
  // }

  // const handleTreatmentSiteChange = (treatmentSite: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('treatmentSite', treatmentSite)

  //   navigate(`/accredited?${params.toString()}`, { replace: true })
  // }
  // const handleStateChange = (state: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('state', state)

  //   navigate(`/accredited?${params.toString()}`, { replace: true })
  // }
  // const handleSquareCheckboxChange = (squareGlobalId: string) => {
  //   const params = new URLSearchParams(searchParams.toString())
  //   params.set('squareGlobalId', squareGlobalId)

  //   navigate(`/accredited?${params.toString()}`, { replace: true })
  // }

  useEffect(() => {
    // Initialize second set of filters
    const doctor = searchParams.get('doctor') || ''
    const treatmentSite = searchParams.get('treatmentSite') || ''
    const status = searchParams.get('state') || ''
    const squares = searchParams.getAll('squareGlobalId')

    setSelectedDoctor(doctor)
    setSelectedTreatmentSite(treatmentSite)
    setSelectedStatus(status)
    setSelectedSquares(squares)
  }, [searchParams])

  const handleDoctorChange = (doctor: string) => {
    setSelectedDoctor(doctor)
  }

  const handleTreatmentSiteChange = (treatmentSite: string) => {
    setSelectedTreatmentSite(treatmentSite)
  }

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status)
  }

  const handleSquareCheckboxChange = (squareGlobalId: string) => {
    setSelectedSquares((prev) =>
      prev.includes(squareGlobalId)
        ? prev.filter((id) => id !== squareGlobalId)
        : [...prev, squareGlobalId]
    )
  }
  const handleClearFilters = () => {
    navigate('/accredited', { replace: true })
  }
  const authToken = useAuthHeader()
  const { data: Accrediteds } = useQuery({
    queryKey: ['AccreditedFilter'],
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

  const uniqueDoctors = Accrediteds?.data
    ? [
        ...new Set(
          Accrediteds.data
            .map((statuse) => statuse.doctor?.trim())
            .filter((doctor) => doctor && doctor.length > 0)
        )
      ]
    : []

  const handleFilter = () => {
    const params = new URLSearchParams()

    if (selectedDoctor) {
      params.set('doctor', selectedDoctor)
    }

    if (selectedTreatmentSite) {
      params.set('treatmentSite', selectedTreatmentSite)
    }

    if (selectedStatus) {
      params.set('state', selectedStatus)
    }

    selectedSquares.forEach((id) => params.append('squareGlobalId', id))

    // Navigate to the desired route with all filters
    navigate(`/accredited?${params.toString()}`, { replace: true })
    // Adjust the route based on where you want to apply the filters
  }
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
              <Select value={selectedDoctor} onValueChange={handleDoctorChange}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر الدكتور" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الدكاتره</SelectLabel>
                    {uniqueDoctors.map((doctor, index) => (
                      <SelectItem key={`${doctor}-${index}`} value={doctor}>
                        {doctor}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="w-[279.35px]  border-b-[1px] border-[#F0F1F5]  pb-5">
              <label className="pr-4 font-bold text-[#414141] ">حسب الموقع</label>
              <Select value={selectedTreatmentSite} onValueChange={handleTreatmentSiteChange}>
                <SelectTrigger>
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
              <Select onValueChange={(value) => handleStatusChange(value)}>
                <SelectTrigger className="">
                  <SelectValue placeholder="اختر الحالة" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>الحالات</SelectLabel>
                    {statuses.map((statuse) => (
                      <SelectItem key={statuse.label} value={String(statuse.label)}>
                        {statuse.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
          <label className="text-black font-bold pr-6">حسب المربعات</label>
          <div className="grid grid-cols-3 gap-4">
            {squares?.data.map((square) => (
              <div key={square.globalId} className="flex items-center mr-6 space-x-2">
                <input
                  type="checkbox"
                  value={square.globalId}
                  checked={selectedSquares.includes(square.globalId)}
                  onChange={() => handleSquareCheckboxChange(square.globalId)}
                  className="ml-2"
                />
                <label
                  className="text-sm truncate"
                  dir="rtl"
                  style={{ maxWidth: '120px' }}
                  title={square.name}
                >
                  {square.name}
                </label>
              </div>
            ))}
          </div>
        </form>

        <DrawerFooter className="flex justify-between p-4">
          <div className="flex justify-between">
            <Button className="bg-[#196CB0]" onClick={handleFilter}>
              فلتر
            </Button>
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
