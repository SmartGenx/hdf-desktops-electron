import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'

import { Pharmacy } from '@renderer/types'
import EditDialog from './edit-dailog'
import DeleteDialog from './delete-dailog'
import EditPharmacyForm from './edit-forms/EditPharmacyForm'
import { SettingTable } from '@renderer/components/tables/settings-table'
type Props = {
  info: Pharmacy[]
  page: string
  pageSize: string
  total: number
}
export default function PharmacyTabel({ info, page, total }: Props) {
  const columns = React.useMemo<ColumnDef<Pharmacy>[]>(
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
        header: 'اسم الصيدلية',
        cell: ({ row }) => <div className="w-full">{row.original.name}</div>
      },
      {
        accessorKey: 'Governorate.name',
        header: 'المحافظة'
      },
      {
        accessorKey: 'startDispenseDate',
        header: 'تاريخ بدأ الصرف'
      },
      {
        accessorKey: 'endispenseDate',
        header: 'تاريخ انتهاءالصرف'
      },

      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog
              className="max-w-2xl"
              content={<EditPharmacyForm id={row.original.globalId} />}
            />
            <DeleteDialog
              url={`/pharmacy/${row.original?.globalId}`}
              keys={['pharmacy']}
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
