import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { HdfTable } from '../../tables/hdfTable'
import { ApplicantByDirectorateViewModelInfo } from '../../../types/index'

type Props = {
  info: ApplicantByDirectorateViewModelInfo[]
  page: string
  pageSize: string
  total: number
}
export default function BackUpTable({ info, page, total, pageSize }: Props) {
  const columns = React.useMemo<ColumnDef<ApplicantByDirectorateViewModelInfo>[]>(
    () => [
      {
        accessorKey: ' .',
        header: 'اسم المستخدم',
        cell: ({ row }) => row.original.name
      },
      {
        accessorKey: '',
        header: 'تاريخ أنشاء النسخة',
        cell: ({ row }) => row.original.gender
      },
      {
        accessorKey: '',
        header: 'المسار',
        cell: ({ row }) => row.original.disease
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
