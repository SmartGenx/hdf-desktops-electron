import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'
import {  MoreVertical } from 'lucide-react'

import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
  const columns = React.useMemo<ColumnDef<DismissalInfo>[]>(
    () => [
      {
        accessorKey: ' .',
        header: 'الأسم',
        cell: ({ row }) => row.original.Accredited?.applicant?.name
      },
      {
        accessorKey: '',
        header: 'اسم الصيدلية',
        cell: ({ row }) => row.original.Accredited?.pharmacy?.name
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
