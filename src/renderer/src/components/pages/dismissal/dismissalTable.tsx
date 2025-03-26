import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { HdfTable } from '../../tables/hdfTable'
import { DismissalInfo } from '../../../types/index'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { Button } from '../../ui/button'
import { MoreVertical } from 'lucide-react'
import { Month } from '../../../types/enums'
import { Link } from 'react-router-dom'

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
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => {
          const currentPage = Number(page) || 1
          const itemsPerPage = Number(pageSize) || 5
          const globalRowNumber = (currentPage - 1) * itemsPerPage + row.index + 1
          return <p>{globalRowNumber}</p>
        },
        enableSorting: false
      },
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
      },
      {
        id: 'actions',

        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="h-17 -mt-[70px] ml-7 min-w-[84.51px] p-0">
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/updateDismissal/${row.original.globalId}`}>تعديل</Link>
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
      pageSize={Number(pageSize)}
    />
  )
}
