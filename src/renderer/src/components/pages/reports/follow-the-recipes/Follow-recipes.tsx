import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../../ui/dropdown-menu'
import { HdfTable } from '../../../tables/hdfTable'
import { AllAccreditedsForPdfInfo } from '../../../../types/index'
import { Button } from '../../../ui/button'

type Props = {
  info: AllAccreditedsForPdfInfo[]
  page: string
  pageSize: string
  total: number
}
export default function FollowReceiptTable({ info, page, total, pageSize }: Props) {
  const columns = React.useMemo<ColumnDef<AllAccreditedsForPdfInfo>[]>(
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
        header: 'تاريخ التشخيص',
        cell: ({ row }) => {
          const date = new Date(row.original.orescriptionDate).toISOString().split('T')[0]
          return date
        }
      },
      {
        accessorKey: '',
        header: 'تاريخ التجديد',
        cell: ({ row }) => {
          const date = new Date(row.original.renewalDate).toISOString().split('T')[0]
          return date
        }
      },
      {
        accessorKey: '',
        header: 'الايام',
        cell: ({ row }) => row.original.days
      },
      {
        accessorKey: '',
        header: 'الشهور',
        cell: ({ row }) => row.original.Months
      },
      {
        accessorKey: '',
        header: 'الحاله',
        cell: ({ row }) => row.original.state
      }
    ],
    [5]
  )
  return (
    <HdfTable
      columns={columns}
      data={info}
      page={page.toString()}
      total={Number(total)}
      pageSize={Number(pageSize)}
      // onRowClick={(_, { original }) => {
      //   navigate(`/state-affairs/info/${}`)
      // }}
    />
  )
}
