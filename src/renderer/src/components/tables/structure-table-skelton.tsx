import { cn } from '@renderer/lib/utils'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const StructureTableSkelton = () => {
  return (
    <div className="animate-pulse">
      <div className="mb-4 h-3 w-36 rounded-xl bg-primary/40" />
      {/* <ScrollArea className="rounded-lg border-2"> */}
      <Table className="relative h-full">
        <TableHeader>
          <TableRow className="border-none">
            {[...Array(5)].map((_, index) => {
              return (
                <TableHead className="border-b p-0 px-5 text-right" key={index}>
                  <div className={cn('h-3 w-32 rounded-xl bg-primary/40', index === 0 && 'w-4')} />
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(3)].map((_, parentIdx) => (
            <TableRow className="border-muted bg-background" key={parentIdx}>
              {[...Array(5)].map((_, index) => (
                <TableCell key={index} className="px-5 py-2 first:rounded-r-lg last:rounded-l-md">
                  <div className={cn('h-2 w-32 rounded-xl bg-primary/40', index === 0 && 'w-4')} />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* </ScrollArea> */}
    </div>
  )
}

export default StructureTableSkelton
