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
import { Link, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate();

  const columns = React.useMemo<ColumnDef<AccreditedInfo>[]>(
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
        accessorKey: 'formNumber',
        header: 'رقم الاستمارة',
        cell: ({ row }) => row.original.formNumber
      },
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
        header: 'الحالة ',
        cell: ({ row }) => {
          return (
            <div
              className={
                row.original.state === 'موقف'
                  ? 'inline-block bg-[#FFDAA0]/[.35] rounded-3xl px-2 py-1 text-sm font-semibold text-[#CEA461] mt-2'
                  : row.original.state === 'مستمر'
                    ? 'inline-block bg-[#C5FFBC]/[.35] rounded-3xl px-2 py-1 text-sm font-semibold text-[#69DB57] mt-2'
                    : row.original.state === 'منتهي'
                      ? 'inline-block bg-[#ffe0e0] rounded-3xl px-2 py-1 text-sm font-semibold text-[#ff0000] mt-2'
                      : ''
              }
            >
              {row.original.state}
            </div>
          )
        }
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
                <ReactToPrint
                  trigger={() => <button>طباعة كرت</button>}
                  content={() => componentRef.current}
                />
                <div className="hidden">
                  <A4LayoutById ref={componentRef} id={row.original.globalId ?? ''} />
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link
                  to={`/accredited/continuingTreatmentRequestFormPreview/${row.original.globalId}`}
                >
                  طباعة إستمارة
                </Link>
              </DropdownMenuItem>
              {/* <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/UpdateAccredited/${row.original.globalId}`}>تعديل</Link>
              </DropdownMenuItem> */}
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                <Link to={`/UpdateApplicant/${row.original.applicant?.globalId}`}> تعديل المتقدم</Link>
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
      onRowClick={(_, { original }) => {
        navigate(`/UpdateAccredited/${original.globalId}`)
      }}
    />
  )
}
