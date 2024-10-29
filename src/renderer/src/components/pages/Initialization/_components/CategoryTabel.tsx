import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Category } from '@renderer/types'
import DeleteDialog from './delete-dailog'
import EditDialog from './edit-dailog'
import EditCategoryForm from './edit-forms/EditCategoryForm'
import { SettingTable } from '@renderer/components/tables/settings-table'
type Props = {
  info: Category[]
  page: string
  total: number
}
export default function CategoryTabel({ info, page, total }: Props) {
  const columns = React.useMemo<ColumnDef<Category>[]>(
    () => [
      {
        accessorKey: 'id',
        header: '#',
        cell: ({ row }) => {
          return <p>{row.index + 1}</p>
        },
        enableSorting: false
      },
      {
        accessorKey: 'name',
        header: 'اسم الفئة'
      },
      {
        accessorKey: 'gender',
        header: 'النسبة',
        cell: ({ row }) => row.original.SupportRatio
      },
      {
        accessorKey: 'directorate.name',
        header: 'الوصف',
        cell: ({ row }) => row.original.description
      },

      {
        id: 'actions',
        header: '',

        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog content={<EditCategoryForm id={row.original.globalId} />} />
            <DeleteDialog
              url={`/category/${row.original?.globalId}`}
              keys={['category']}
              path={'Initialization'}
            />
          </div>
        )
      }
    ],
    [page]
  )
  return (
    <SettingTable
      columns={columns}
      data={info}
      page={page.toString()}
      total={Number(total)}

      // onRowClick={(_, { original }) => {
      //   navigate(`/state-affairs/info/${}`)
      // }}
    />
  )
}
