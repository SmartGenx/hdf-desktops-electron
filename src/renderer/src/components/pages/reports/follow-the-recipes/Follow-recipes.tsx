import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { AllAccreditedsForPdfInfo } from '../../../../types/index'
import { ReportsTable } from '@renderer/components/tables/report-table'
function formatDate(value: unknown) {
  const d = new Date(String(value))
  return isNaN(d.getTime()) ? '' : d.toISOString().split('T')[0]
}
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
        header: 'تاريخ التشخيص',
        accessorKey: 'orescriptionDate',
        cell: ({ getValue }) => formatDate(getValue())
      },
      {
        header: 'تاريخ التجديد',
        accessorKey: 'renewalDate',
        cell: ({ getValue }) => formatDate(getValue())
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
        cell: ({ row }) => {
          return (
            <p
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
            </p>
          )
        }
      }
    ],
    [page, pageSize]
  )
  return (
    <ReportsTable
      columns={columns}
      data={info}
      page={page.toString()}
      total={Number(total)}
      pageSize={Number(pageSize)}
     
    />
  )
}
