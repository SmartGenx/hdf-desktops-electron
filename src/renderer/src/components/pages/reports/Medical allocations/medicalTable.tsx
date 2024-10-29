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

const monthNames = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
]

export default function MedicalTable({ info, page, total, pageSize }: Props) {
  const columns = React.useMemo<ColumnDef<ApplicantByDirectorateViewModelInfo>[]>(
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
        accessorKey: 'name',
        header: 'الأسم',
        cell: ({ row }) => row.original.name
      },
      {
        accessorKey: 'gender',
        header: 'الجنس',
        cell: ({ row }) => {
          return row.original.gender === 'M' ? 'ذكر' : 'انثى'
        }
      },
      {
        accessorKey: 'disease',
        header: 'تصنيف المرض',
        cell: ({ row }) => row.original.disease
      },
      {
        accessorKey: 'directorate',
        header: 'المنطقة',
        cell: ({ row }) => row.original.directorate
      },
      {
        accessorKey: 'phoneNumber',
        header: 'الجوال',
        cell: ({ row }) => row.original.phoneNumber
      },
      {
        accessorKey: 'state',
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
        accessorKey: 'Months',
        header: 'الشهر',
        cell: ({ row }) => {
          const monthIndex = row.original.Months ;


          return  monthNames[parseInt(monthIndex) - 1];
        }
      },
      {
        accessorKey: 'year',
        header: 'السنة',
        cell: ({ row }) => row.original.year
      },
      {
        accessorKey: 'totalAmount',
        header: 'تكلفة العلاج',
        cell: ({ row }) => row.original.totalAmount + ' ريال'
      },
      {
        accessorKey: 'supportRatio',
        header: 'نسبة الخصم',
        cell: ({ row }) => row.original.supportRatio
      },
      {
        accessorKey: 'approvedAmount',
        header: 'مساهمة المريض',
        cell: ({ row }) => row.original.approvedAmount + ' ريال'
      }
    ],
    [page, pageSize]
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
