import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'
import { MoreVertical } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../ui/dropdown-menu'
import { HdfTable } from '../../../tables/hdfTable'
import { ApplicantByDirectorateViewModel } from '../../../../types/index'
import { Button } from '../../../ui/button'

import { Month } from '../../../../types/enums'
type Props = {
  data: ApplicantByDirectorateViewModel[]
}
export default function MedicalTable({ data }: Props) {
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<ApplicantByDirectorateViewModel>[]>(
    () => [
      {
        accessorKey: ' .',
        header: 'الأسم',
        cell: ({ row }) => row.original.name
      },
      {
        accessorKey: '',
        header: 'الجنس',
        cell: ({ row }) => row.original.gender
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
        header: 'الحاله',
        cell: ({ row }) => row.original.state
      },
      {
        accessorKey: '',
        header: 'تكلفة العلاج',
        cell: ({ row }) => row.original.totalAmount
      },
      {
        accessorKey: '',
        header: 'نسبة الخصم',
        cell: ({ row }) => row.original.supportRatio
      },
      {
        accessorKey: '',
        header: 'مساهمة المريض',
        cell: ({ row }) => row.original.approvedAmount
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
