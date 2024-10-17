import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { HdfTable } from '../../tables/hdfTable'
import { DismissalInfo } from '../../../types/index'
import { Button } from '../../ui/button'

import { Month } from '../../../types/enums'
type Props = {
  info: DismissalInfo[]
  page: string
  pageSize: string
  total: number
}
export default function DismissalTable({ info, page, total, pageSize }: Props) {
  const columns = React.useMemo<ColumnDef<DismissalInfo>[]>(
    () => [
      {
        accessorKey: ' .',
        header: 'رقم الاعتماد',
        cell: ({ row }) => row.original.Accredited?.numberOfRfid
      },
      {
        accessorKey: '',
        header: 'اسم الدكتور',
        cell: ({ row }) => row.original.Accredited?.doctor
      },
      {
        accessorKey: '',
        header: 'الشهر',
        cell: ({ row }) => {
          const numMonth = row.original.month // Extract the month value from the row
          return Month[+numMonth]
        }
      },
      {
        accessorKey: 'dateToDay',
        header: 'تاريخ الصرف',
        cell: ({ row }) => {
          const date = new Date(row.original.dateToDay)
          return new Intl.DateTimeFormat('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }).format(date)
        }
      },
      {
        accessorKey: '',
        header: 'رقم RFD ',
        cell: ({ row }) => row.original.Accredited?.numberOfRfid
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
      pageSize={Number(pageSize)}
      // onRowClick={(_, { original }) => {
      //   navigate(`/state-affairs/info/${}`)
      // }}
    />
  )
}
