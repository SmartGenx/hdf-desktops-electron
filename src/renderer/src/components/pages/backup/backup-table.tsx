import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { BackUpTablePen } from '@renderer/components/tables/back-up-tablePen'
export interface backUps {
  id: number
  globalId: string
  userName: string
  path: string
  createAt: Date
  deleted: boolean
  version: number
  lastModified: Date
}
type Props = {
  info: backUps[]
  page: string
  pageSize: string
  total: number
}
export default function BackUpTable({ info, page, total, pageSize }: Props) {
  const columns = React.useMemo<ColumnDef<backUps>[]>(
    () => [
      {
        accessorKey: ' .',
        header: 'اسم المستخدم',
        cell: ({ row }) => row.original.userName
      },
      {
        accessorKey: '',
        header: 'تاريخ أنشاء النسخة',
        cell: ({ row }) => {
          return <p>{String(row.original.createAt).split('T')[0]}</p>
        }
      },
      {
        accessorKey: '',
        header: 'المسار',
        cell: ({ row }) => row.original.path
      }
    ],
    [5]
  )
  return (
    <BackUpTablePen
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
