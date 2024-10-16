import Boutton from '@renderer/components/Boutton'
import { Link } from 'react-router-dom'
import BackUpTable from './backup-table'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { ApplicantByDirectorateViewModel } from '@renderer/types'
import { useAuthHeader } from 'react-auth-kit'
import BackupDailog from './backup-dailog'
import { useState } from 'react'

export default function BackUpIndex() {
  const [isOpen, setIsOpen] = useState(false)
  const authToken = useAuthHeader()
  const {
    isPending: isPendingViewModel,
    isError: _isErrorViewModel,
    error: errorViewModel,
    data: ApplicantByDirectorateViewModelData
  } = useQuery({
    queryKey: ['ApplicantByDirectorateViewModel'],
    queryFn: () =>
      getApi<ApplicantByDirectorateViewModel>('/applicant/ApplicantByDirectorateViewModel', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  if (isPendingViewModel) return 'Loading...'
  if (errorViewModel) return 'An error has occurred: ' + errorViewModel.message
  return (
    <>
      <div className="flex  gap-5 mt-[15px] items-center justify-end mb-10 ">
        <div className="flex gap-7">
          <BackupDailog />
        </div>
      </div>

      <BackUpTable
        info={ApplicantByDirectorateViewModelData.data.info || []}
        page={ApplicantByDirectorateViewModelData.data.page || '1'}
        pageSize={ApplicantByDirectorateViewModelData.data.pageSize || '5'}
        total={ApplicantByDirectorateViewModelData.data.total || 10}
      />
    </>
  )
}
