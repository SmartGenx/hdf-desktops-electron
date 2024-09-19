import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'
import { MoreHorizontal, MoreVertical } from 'lucide-react'

import { Link, useNavigate } from 'react-router-dom'


// import DeleteDialog from '@/components/delete-dialog'
// import { Paths } from '@/enums'
import { cn } from '@/lib/utils'
import DeleteDialog from '@renderer/components/ui/delete-dailog'
import { ApplicantsInfo } from '@renderer/types'
import { Gender } from '@renderer/types/enums'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@renderer/components/ui/dropdown-menu'
import { Button } from '@renderer/components/ui/button'
import { HdfTable } from '@renderer/components/tables/hdfTable'
type Props = {
  info: ApplicantsInfo[]
  page: string
  pageSize: string
  total: number
}
export default function CategoryTabel({info,page,pageSize,total}:Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<ApplicantsInfo>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'اسم الفئة'
      },
      {
        accessorKey: 'gender',
        header: 'النسبة',
        cell: ({ row }) => {
          const gender = row.original.gender
          return Gender[gender]
        }
      },
      {
        accessorKey: 'directorate.name',
        header: 'الوصف',
        cell: ({ row }) => row.original.directorate?.name
      },
      
      {
        id: 'actions',
        header: "",

        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/UpdateApplicant/${row.original.globalId}`}>تعديل</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <DeleteDialog
                  url={`/applicant/${row.original?.globalId}`}
                  keys={['applicant']}
                  path={'applicants'}
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
