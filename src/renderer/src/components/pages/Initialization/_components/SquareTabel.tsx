import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'

import { Governorate } from '@renderer/types'
import EditDialog from './edit-dailog'
import DeleteDialog from './delete-dailog'
import EditSquareForm from './edit-forms/EditSquareForm'
import { SettingTable } from '@renderer/components/tables/settings-table'
type Props = {
  info: Governorate[]
  page: string
  pageSize: string
  total: number
}
export default function SquareTabel({ info, page, total }: Props) {
  const columns = React.useMemo<ColumnDef<Governorate>[]>(
    () => [
      {
        accessorKey: 'name',
        header: () => <div className="w-96">المربع</div>,
        cell: ({ row }) => <div className="w-full">{row.original.name}</div>
      },

      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog content={<EditSquareForm id={row.original.globalId} />} />
            <DeleteDialog
              url={`/square/${row.original?.globalId}`}
              keys={['square']}
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
