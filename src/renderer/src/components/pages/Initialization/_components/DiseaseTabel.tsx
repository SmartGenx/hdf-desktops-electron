import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
// import { GevStatus, GovernmentFacility, kind_of_case } from '../../../types/enum'



// import DeleteDialog from '@/components/delete-dialog'
// import { Paths } from '@/enums'
import { DiseasesApplicant } from '@renderer/types'

import { HdfTable } from '@renderer/components/tables/hdfTable'
import EditDialog from './edit-dailog'
import DeleteDialog from './delete-dailog'
import EditDiseaseForm from './edit-forms/EditDiseaseForm'
type Props = {
  info: DiseasesApplicant[]
  page: string
  pageSize: string
  total: number
}
export default function DiseaseTabel({info,page,total}:Props) {
  const columns = React.useMemo<ColumnDef<DiseasesApplicant>[]>(
    () => [
      {
        accessorKey: 'name',
        header:() => <div className='w-96'>المرض</div> ,
      },
      {
        accessorKey: 'description',
        header:() => <div className='w-96'>الوصف</div> ,
      },
      
      
      {
        id: 'actions',
        header: "",
        cell: ({ row }) => (
          <div className="flex w-fit">
            <EditDialog
            className='max-w-3xl'
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
