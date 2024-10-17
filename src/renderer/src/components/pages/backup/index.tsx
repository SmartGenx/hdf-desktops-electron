import BackUpTable from './backup-table'
import { useQuery } from '@tanstack/react-query'
import { getApi } from '@renderer/lib/http'
import { useAuthHeader } from 'react-auth-kit'
import BackupDialog from './backup-dailog'

export interface BackUpInfos {
  id: number
  globalId: string
  userName: string
  path: string
  createAt: Date
  deleted: boolean
  version: number
  lastModified: Date
}

export default function BackUpIndex() {
  const authToken = useAuthHeader()
  const {
    isPending: isPendingViewModel,
    isError: _isErrorViewModel,
    error: errorViewModel,
    data: BackUps
  } = useQuery({
    queryKey: ['backUp'],
    queryFn: () =>
      getApi<BackUpInfos[]>('/backUp', {
        headers: {
          Authorization: authToken()
        }
      })
  })

  console.log('BackUps', BackUps?.data)
  if (isPendingViewModel) return 'Loading...'
  if (errorViewModel) return 'An error has occurred: ' + errorViewModel.message
  return (
    <>
      <div className="flex  gap-5 mt-[15px] items-center justify-end mb-10 ">
        <div className="flex gap-7">
          <BackupDialog />
        </div>
      </div>

      <BackUpTable
        info={BackUps?.data || []}
        page={'1'}
        pageSize={'5'}
        total={BackUps?.data.length}
      />
    </>
  )
}
