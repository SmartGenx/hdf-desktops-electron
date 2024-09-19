import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'
import { MoreVertical } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../ui/dropdown-menu'
import { HdfTable } from '../../../tables/hdfTable'
import { applicantsReportCategory } from '../../../../types/index'
import { Button } from '../../../ui/button'

type Props = {
  data: applicantsReportCategory[]
}
export default function WaitingTable({ data }: Props) {
  const columns = React.useMemo<ColumnDef<applicantsReportCategory>[]>(
    () => [
      {
        accessorKey: ' .',
        header: 'الأسم',
        cell: ({ row }) => row.original.name
      },

      {
        accessorKey: '',
        header: 'تصنيف المرض',
        cell: ({ row }) => row.original.disease
      },
      {
        accessorKey: '',
        header: 'المنطقة',
        cell: ({ row }) => row.original.directorate
      },
      {
        accessorKey: '',
        header: 'الجوال',
        cell: ({ row }) => row.original.phoneNumber
      },
      {
        accessorKey: '',
        header: 'تاريخ التقديم',
        cell: ({ row }) => {
          const date = new Date(row.original.submissionDate).toISOString().split('T')[0]
          return date
        }
      },
      {
        accessorKey: 'category',
        header: 'فئة'
      },

      {
        id: 'actions',
        header: () => (
          <div>
            <MoreVertical />
          </div>
        ),

        cell: () => (
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
                {/* <DeleteDialog
                  url={`/Organization/${row.original?.id}`}
                  revalidatePath={Paths.localOrg}
                /> */}
                حذف
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    [5]
  )
  return (
    <HdfTable
      columns={columns}
      data={data}
      page={String(5)}
      total={Number(5)}
      // onRowClick={(_, { original }) => {
      //   navigate(`/state-affairs/info/${}`)
      // }}
    />
  )
}
