import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'
import { MoreHorizontal, MoreVertical } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { HdfTable } from '../../tables/hdfTable'
import { AccreditedInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import { Gender } from '../../../types/enums'
// import DeleteDialog from '@/components/delete-dialog'
// import { Paths } from '@/enums'
import { cn } from '@/lib/utils'
import DeleteDialog from '@renderer/components/ui/delete-dailog'
type Props = {
  info: AccreditedInfo[]
  page: string
  pageSize: string
  total: number
}
export default function AccreditedTable({ info, page, total, pageSize }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<AccreditedInfo>[]>(
    () => [
      {
        accessorKey: 'applicant',
        header: 'الأسم',
        cell: ({ row }) => row.original.applicant?.name
      },
      {
        accessorKey: 'square.name',
        header: 'المربع',
        cell: ({ row }) => row.original.square?.name
      },
      {
        accessorKey: 'treatmentSite',
        header: 'موقع العلاج'
      },
      {
        accessorKey: 'doctor',
        header: 'الدكتور المعالج'
      },
      {
        accessorKey: 'state',
        header: 'الحالة '
      },
      {
        id: 'actions',
        header: () => (
          <div>
            <MoreVertical />
          </div>
        ),

        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                {/* <DeleteDialog
                  url={`/Organization/${row.original?.id}`}
                  revalidatePath={Paths.localOrg}
                /> */}
                تعديل
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/accredited/${row.original?.globalId}`}
                  keys={['accredited']}
                  path={'accredited'}
                />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [page]
  )
  return (
    <HdfTable
      columns={columns}
      data={info}
      page={page.toString()}
      total={Number(total)}
      // onRowClick={(_, { original }) => {
      //   navigate(`/state-affairs/info/${}`)
      // }}
    />
  )
}
