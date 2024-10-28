import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { ApplicantByDirectorateViewModelInfo } from '../../../../types/index'
import { MedicalTables } from '@renderer/components/tables/medical-table'

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
        cell: ({ row }) => {
          return row.original.gender === 'M' ? 'ذكر' : 'انثى'
        }
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
      },
      {
        accessorKey: 'totalAmount',
        header: 'تكلفة العلاج',
        cell: ({ row }) => row.original.totalAmount + 'ريال'
      },
      {
        accessorKey: '',
        header: 'نسبة الخصم',
        cell: ({ row }) => {
          return row.original.supportRatio
        }
      },
      {
        accessorKey: 'approvedAmount',
        header: 'مساهمة المريض',
        cell: ({ row }) => row.original.approvedAmount + 'ريال'
      }
    ],
    [5]
  )

  return (
    <MedicalTables
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
