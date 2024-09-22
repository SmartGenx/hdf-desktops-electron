import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'



// import DeleteDialog from '@/components/delete-dialog'
// import { Paths } from '@/enums'
import {  Directorate } from '@renderer/types'

import { HdfTable } from '@renderer/components/tables/hdfTable'
import EditDialog from './edit-dailog'
import EditDirectorateForm from './edit-forms/EditDirectorateForm'
import DeleteDialog from './delete-dailog'
type Props = {
  info: Directorate[]
  page: string
  pageSize: string
  total: number
}
export default function DirectorateTabel({info,page,total}:Props) {
  const columns = React.useMemo<ColumnDef<Directorate>[]>(
    () => [
      {
        accessorKey: 'name',
        header:() => <div className='w-96'>المديرية</div> ,
      },
      
      
      {
        id: 'actions',
        header: "",
        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog
              content={<EditDirectorateForm id={row.original.globalId} />}
            />
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
    <HdfTable
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
