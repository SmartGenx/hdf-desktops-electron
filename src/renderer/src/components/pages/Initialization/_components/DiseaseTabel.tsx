import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DiseasesApplicant } from '@renderer/types'
import EditDialog from './edit-dailog'
import DeleteDialog from './delete-dailog'
import EditDiseaseForm from './edit-forms/EditDiseaseForm'
import { SettingTable } from '@renderer/components/tables/settings-table'
type Props = {
  info: DiseasesApplicant[]
  page: string
  pageSize: string
  total: number
}
export default function DiseaseTabel({ info, page, total }: Props) {
  const columns = React.useMemo<ColumnDef<DiseasesApplicant>[]>(
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
        header: () => <div className="w-96">المرض</div>
      },
      {
        accessorKey: 'description',
        header: () => <div className="w-96">الوصف</div>
      },

      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog
              className="max-w-3xl"
              content={<EditDiseaseForm id={row.original.globalId} />}
            />
            <DeleteDialog
              url={`/disease/${row.original?.globalId}`}
              keys={['disease']}
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
