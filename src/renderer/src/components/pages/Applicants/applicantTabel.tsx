import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { MoreVertical } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu'
import { HdfTable } from '../../tables/hdfTable'
import { ApplicantsInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import DeleteDialog from '@renderer/components/ui/delete-dailog'
type Props = {
  info: ApplicantsInfo[]
  page: string
  pageSize: string
  total: number
}
export default function StateTable({ info, page, total, pageSize }: Props) {
  const columns = React.useMemo<ColumnDef<ApplicantsInfo>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'الأسم'
      },
      {
        accessorKey: 'gender',
        header: 'الجنس',
        cell: ({ row }) => {
          const gender = row.original.gender
          return gender === 'M' ? 'ذكر' : 'انثى'
        }
      },
      {
        accessorKey: 'directorate.name',
        header: 'المديرية',
        cell: ({ row }) => row.original.directorate?.name
      },
      {
        accessorKey: 'category.name',
        header: 'الفئة',
        cell: ({ row }) => row.original.category.name
      },
      {
        accessorKey: 'phoneNumber',
        header: 'رقم الجوال'
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
      pageSize={Number(pageSize)}
      // onRowClick={(_, { original }) => {
      //   navigate(`/state-affairs/info/${}`)
      // }}
    />
  )
}
