import { cn } from '@renderer/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  title?: string
  className?: string
}

export function StructureTable<TData, TValue>({
  columns,
  data,
  title,
  className
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  })

  return (
    // <ScrollArea className="h-[170px] rounded-lg border-2">
    <>
      <div className={cn('rounded-lg bg-white', className)}>
        <h3 className=" ms-4  font-bold">{title}</h3>
        <Table className="relative text-center border-separate border-spacing-y-1 p-4">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-none">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="border-b  p-0 px-5 text-center text-black"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                className=" text-nowrap bg-SurfContainerLow   text-base font-medium "
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="px-5 py-2 ">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
