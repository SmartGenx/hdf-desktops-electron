import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { applicantsReportCategory } from '../../../../types/index'
import { ReportsTable } from '@renderer/components/tables/report-table'

type Props = {
  info: applicantsReportCategory[]
  page: string
  pageSize: string
  total: number
}
export default function WaitingTable({ info, page, total, pageSize }: Props) {
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
      }
    ],
    [5]
  )
  return (
    <ReportsTable
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
