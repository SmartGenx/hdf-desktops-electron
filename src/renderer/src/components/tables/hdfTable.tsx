import { useState, useEffect, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { ColumnDef, flexRender, getCoreRowModel, Row, useReactTable } from '@tanstack/react-table'
import { cn } from '../../lib/utils'
// import TablePagination from '../../ui/table-pagination'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: Row<TData>) => void
  lastHeaderStyle?: string
  compact?: boolean
  lightHeader?: boolean
  total: number
  page: string
  shadow?: boolean
  containerClaasName?: string
}
export function HdfTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  compact,
  lastHeaderStyle,
  lightHeader = false,
  shadow = true,

  containerClaasName
}: DataTableProps<TData, TValue>) {
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  useEffect(() => {
    const updateScreenSize = () => {
      setIsLargeScreen(window.innerWidth >= 768) // Adjust breakpoint as needed
    }
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    return () => {
      window.removeEventListener('resize', updateScreenSize)
    }
  }, [])
  const tableColumns = isLargeScreen ? columns : columns.slice(0, 2)
  const table = useReactTable({
    data,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel()
  })
  const onRowClickHandler = useCallback(
    (event: React.MouseEvent<HTMLTableRowElement, MouseEvent>, row: Row<TData>) => {
      const target = event.target as HTMLElement
      if (target.closest('td') && onRowClick) {
        onRowClick(event, row)
      }
    },
    [onRowClick]
  )
  return (
    <div
      className={cn(
        'relative space-y-6 overflow-hidden rounded-lg  border-[#D4D5E5]  dark:bg-primary',
        shadow ? 'shadow-CardEffect' : 'shadow-none',
        containerClaasName
      )}
    >
      <Table className="relative border-separate border-spacing-y-0 rounded-lg    ">
        <ScrollArea className="h-[calc(70vh-220px)]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className={cn('px text-nowrap  text-sm font-medium  hover:bg-[#E5F0FF] bg-[#E5F0FF]', {
                  'bg-primary/5': lightHeader
                })}
              >
                {headerGroup.headers.map((header, i) => {
                  return (
                    <TableHead
                      className={cn(
                        ' my-4 border-b  border-OutlineVariant text-right align-middle text-accent-foreground ',
                        lastHeaderStyle && i == headerGroup.headers.length - 1 && lastHeaderStyle
                      )}
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
            <TableRow className="h-4"></TableRow>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={(e) => onRowClickHandler(e, row)}
                  className={cn(
                    'borders  w-full text-nowrap bg-background  text-base font-medium odd:bg-[#F4F4F4] even:bg-white hover:outline hover:outline-2 hover:outline-primary dark:odd:bg-[#F4F4F4]/50 dark:even:bg-background/0 dark:hover:outline-white ',
                    {
                      'cursor-pointer': onRowClick
                    }
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'text-right  ',
                        {
                          // lastHeaderStyle: lastHeaderStyle,
                          'p-2': !compact
                        },
                        lastHeaderStyle &&
                          // i == table.getRowModel().rows.length - 1 &&
                          lastHeaderStyle
                      )}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow className="border-muted bg-background">
                <TableCell
                  colSpan={columns.length}
                  className="p-4 text-center first:rounded-r-lg last:rounded-l-md"
                >
                  لاتوجد بيانات
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Table>
      {/* <TablePagination total={total} page={parseInt(page, 10) || 1} pageSize={10} /> */}
    </div>
  )
}
