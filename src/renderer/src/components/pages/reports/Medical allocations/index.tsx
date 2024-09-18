import Boutton from '@renderer/components/Boutton'
import SearchInput from '@renderer/components/searchInput'
import { Button } from '@renderer/components/ui/button'
import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FilterDrawer from './filter'
import { useAuthHeader } from 'react-auth-kit'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { ApplicantByDirectorateViewModel, Dismissales } from '@renderer/types'
import MedicalTable from './medicalTable'

export default function MedicalAllocationsIndex() {
  const navigate = useNavigate()
  const authToken = useAuthHeader()
  const {
    isPending,
    error,
    data: ApplicantByDirectorateViewModelData
  } = useQuery({
    queryKey: ['ApplicantByDirectorateViewModel'],
    queryFn: () =>
      getApi<ApplicantByDirectorateViewModel[]>('/applicant/ApplicantByDirectorateViewModel', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  return (
    <>
      <div className="flex  gap-5 mt-[85px] items-center justify-between   mb-7">
        <div className="w-fit">
          <h1 className="text-2xl font-medium">جدول المخصصات العلاجية</h1>
        </div>
        <div className="flex gap-2">
          <SearchInput />
          <FilterDrawer />
          <Link to={'/formDismissal'}>
            <Boutton
              icon="print"
              title={'طباعة'}
              className="bg-[#196CB0] hover:bg-[#2d5372] focus:ring-[#2d5372]"
            />
          </Link>
          <Link to={'/formDismissal'}>
            <Boutton
              icon="addaccredited"
              title={'تصدير'}
              className="bg-[#92A709] hover:bg-[#5b6806] focus:ring-[#92A709]"
            />
          </Link>
        </div>
      </div>
      <MedicalTable data={ApplicantByDirectorateViewModelData.data} />
    </>
  )
}