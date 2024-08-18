import { Pagination, PaginationContent, PaginationItem } from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { Button } from '../ui/button'

interface TablePaginationProps {
  total: number
  page: number
  pageSize: number
}

const TablePagination: React.FC<TablePaginationProps> = ({ total, page, pageSize }) => {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const router = useRouter()

  const pages: number[] = []
  for (let index = 0; index < Math.ceil(total / pageSize); index++) {
    pages.push(index + 1)
  }

  const updatePage = (newPage: number) => {
    if (newPage === page) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', newPage.toString())
    router.replace(`${pathname}?${params.toString()}`)
  }

  const handlePreviousPage = () => {
    if (page > 1) {
      updatePage(page - 1)
    }
  }

  const handleNextPage = () => {
    if (page < pages.length) {
      updatePage(page + 1)
    }
  }

  const getPageItems = () => {
    const items: any[] = []
    if (page > 2) items.push(1, '...')
    if (page > 1) items.push(page - 1)
    items.push(page)
    if (page < pages.length) items.push(page + 1)
    if (page < pages.length - 1) items.push('...', pages.length)
    return items
  }

  return (
    <Pagination className="rtl">
      <PaginationContent>
        <PaginationItem>
          <Button
            className="!cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={handlePreviousPage}
            disabled={page <= 1}
          >
            <ChevronRight size={18} />
          </Button>
        </PaginationItem>
        {getPageItems().map((item, index) =>
          typeof item === 'number' ? (
            <PaginationItem key={index}>
              <Button
                className={`dark:text-white hover:text-primary ${item !== page && 'bg-[#EEEFEF] text-[#434749] '}`}
                variant={'default'}
                size="sm"
                onClick={() => updatePage(item)}
              >
                {item}
              </Button>
            </PaginationItem>
          ) : (
            <PaginationItem key={index}>
              <span>{item}</span>
            </PaginationItem>
          )
        )}
        <PaginationItem>
          <Button
            className="cursor-pointer"
            variant="ghost"
            size="sm"
            onClick={handleNextPage}
            disabled={page >= pages.length}
          >
            <ChevronLeft size={18} />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export default TablePagination
