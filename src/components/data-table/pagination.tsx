import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { cn, getPageNumbers } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type DataTablePaginationProps<TData> = {
  table: Table<TData>
  totalRows?: number
  currentPage?: number
  pageSize?: number
}

export function DataTablePagination<TData>({
  table,
  totalRows = 0,
  currentPage = table.getState().pagination.pageIndex + 1,
  pageSize = table.getState().pagination.pageSize,
}: DataTablePaginationProps<TData>) {
  const totalPages = Math.max(Math.ceil(totalRows / pageSize), 1)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  const canPreviousPage = currentPage > 1
  const canNextPage = currentPage < totalPages

  return (
    <div
      className={cn(
        'flex items-center justify-between overflow-clip px-2',
        '@max-2xl/main:flex-col-reverse @max-2xl/main:gap-4'
      )}
      style={{ overflowClipMargin: 1 }}
    >
      {/* Left side */}
      <div className='flex w-full items-center justify-between'>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium @2xl/main:hidden'>
          Page {currentPage} of {totalPages}
        </div>
        <div className='flex items-center gap-2 @max-2xl/main:flex-row-reverse'>
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
              // reset ke page 1 saat ubah page size
              table.setPageIndex(0)
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((size) => (
                <SelectItem key={size} value={`${size}`}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className='hidden text-sm font-medium sm:block'>Rows per page</p>
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center sm:space-x-6 lg:space-x-8'>
        <div className='flex w-[100px] items-center justify-center text-sm font-medium @max-3xl/main:hidden'>
          Page {currentPage} of {totalPages}
        </div>

        <div className='flex items-center space-x-2'>
          {/* First */}
          <Button
            variant='outline'
            className='size-8 p-0 @max-md/main:hidden'
            onClick={() => table.setPageIndex(0)}
            disabled={!canPreviousPage}
          >
            <span className='sr-only'>Go to first page</span>
            <DoubleArrowLeftIcon className='h-4 w-4' />
          </Button>

          {/* Prev */}
          <Button
            variant='outline'
            className='size-8 p-0'
            onClick={() => table.setPageIndex(currentPage - 2)}
            disabled={!canPreviousPage}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>

          {/* Page Numbers */}
          {pageNumbers.map((pageNumber, i) =>
            pageNumber === '...' ? (
              <span
                key={`${pageNumber}-${i}`}
                className='text-muted-foreground px-1 text-sm'
              >
                ...
              </span>
            ) : (
              <Button
                key={pageNumber}
                variant={currentPage === pageNumber ? 'default' : 'outline'}
                className='size-8 p-0'
                onClick={() => table.setPageIndex((pageNumber as number) - 1)}
              >
                {pageNumber}
              </Button>
            )
          )}

          {/* Next */}
          <Button
            variant='outline'
            className='size-8 p-0'
            onClick={() => table.setPageIndex(currentPage)}
            disabled={!canNextPage}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>

          {/* Last */}
          <Button
            variant='outline'
            className='size-8 p-0 @max-md/main:hidden'
            onClick={() => table.setPageIndex(totalPages - 1)}
            disabled={!canNextPage}
          >
            <span className='sr-only'>Go to last page</span>
            <DoubleArrowRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  )
}
