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
import { AccreditedInfo } from '../../../types/index'
import { Button } from '../../ui/button'
import DeleteDialog from '@renderer/components/ui/delete-dailog'
import { Link } from 'react-router-dom'
import ReactToPrint from 'react-to-print'
import A4LayoutById from './print-card-id'
type Props = {
  info: AccreditedInfo[]
  page: string
  pageSize: string
  total: number
}
export default function AccreditedTable({ info, page, total, pageSize }: Props) {
  const componentRef = React.useRef<HTMLDivElement>(null)
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
                <ReactToPrint
                  trigger={() => (
                    <button className=" flex items-center text-[#000] rounded-lg hover:bg-[#2d5372] px-3 focus:ring-[#2d5372]">
                      طباعة
                    </button>
                  )}
                  content={() => componentRef.current}
                />
                <div className="hidden">
                  <A4LayoutById ref={componentRef} id={row.original.globalId ?? ''} />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/UpdateAccredited/${row.original.globalId}`}>تعديل</Link>
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
      pageSize={Number(pageSize)}
      // onRowClick={(_, { original }) => {
      //   navigate(`/state-affairs/info/${}`)
      // }}
    />
  )
}
