import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Directorate } from '@renderer/types'
import EditDialog from './edit-dailog'
import EditDirectorateForm from './edit-forms/EditDirectorateForm'
import DeleteDialog from './delete-dailog'
import { SettingTable } from '@renderer/components/tables/settings-table'
type Props = {
  info: Directorate[]
  page: string
  total: number
}
export default function DirectorateTabel({ info, page, total }: Props) {
  const columns = React.useMemo<ColumnDef<Directorate>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => <div className="w-96">المديرية</div>
      },

      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog content={<EditDirectorateForm id={row.original.globalId} />} />
            <DeleteDialog
              url={`/directorate/${row.original?.globalId}`}
              keys={['directorate']}
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
