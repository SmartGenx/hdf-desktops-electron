import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Governorate } from '@renderer/types'
import EditDialog from './edit-dailog'
import EditGovernorateForm from './edit-forms/EditGovernorateForm'
import DeleteDialog from './delete-dailog'
import { SettingTable } from '@renderer/components/tables/settings-table'
type Props = {
  info: Governorate[]
  page: string
  // pageSize: string
  total: number
}
export default function GovernorateTabel({ info, page, total }: Props) {
  const columns = React.useMemo<ColumnDef<Governorate>[]>(
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
        header: () => <div className="w-96">المحافظة</div>,
        cell: ({ row }) => <div className="w-full">{row.original.name}</div>
      },

      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog content={<EditGovernorateForm id={row.original.globalId} />} />
            <DeleteDialog
              url={`/governorate/${row.original?.globalId}`}
              keys={['governorate']}
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
