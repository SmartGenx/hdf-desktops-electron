import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { HdfTable } from '../../../tables/hdfTable'
import { ApplicantByDirectorateViewModelInfo } from '../../../../types/index'


type Props = {
  info: ApplicantByDirectorateViewModelInfo[]
  page: string
  pageSize: string
  total: number
}
export default function MedicalTable({ info, page, total, pageSize }: Props) {
  const columns = React.useMemo<ColumnDef<ApplicantByDirectorateViewModelInfo>[]>(
    () => [
      {
        accessorKey: ' .',
        header: 'الأسم',
        cell: ({ row }) => row.original.name
      },
      {
        accessorKey: '',
        header: 'الجنس',
        cell: ({ row }) => row.original.gender
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
        header: 'الحاله',
        cell: ({ row }) => row.original.state
      },
      {
        accessorKey: '',
        header: 'تكلفة العلاج',
        cell: ({ row }) => row.original.totalAmount
      },
      {
        accessorKey: '',
        header: 'نسبة الخصم',
        cell: ({ row }) => row.original.supportRatio
      },
      {
        accessorKey: '',
        header: 'مساهمة المريض',
        cell: ({ row }) => row.original.approvedAmount
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
