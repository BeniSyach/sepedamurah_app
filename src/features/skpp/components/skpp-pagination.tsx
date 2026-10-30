import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import { useSkpp } from './skpp-provider'

export function SkppPagination() {
  const { meta, page, setPage, perPage, setPerPage } = useSkpp()

  if (!meta) return null

  const currentPage = meta.current_page || page
  const totalPages = Math.max(1, meta.last_page || 1)
  const canPrev = currentPage > 1
  const canNext = currentPage < totalPages

  return (
    <div className='flex flex-col sm:flex-row items-center justify-between gap-3 px-2 py-3 border-t'>
      <div className='flex items-center gap-2 text-xs text-muted-foreground'>
        <span>Tampilkan</span>
        <Select
          value={perPage.toString()}
          onValueChange={(val) => {
            setPerPage(Number(val))
            setPage(1)
          }}
        >
          <SelectTrigger className='h-8 w-18 text-xs'>
            <SelectValue placeholder={perPage.toString()} />
          </SelectTrigger>
          <SelectContent side='top'>
            {[10, 20, 30, 50, 100].map((pageSize) => (
              <SelectItem key={pageSize} value={pageSize.toString()}>
                {pageSize}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span>per halaman • Total {meta.total} data</span>
      </div>

      <div className='flex items-center space-x-2'>
        <span className='text-xs text-muted-foreground mr-2'>
          Halaman {currentPage} dari {totalPages}
        </span>
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex'
          onClick={() => setPage(1)}
          disabled={!canPrev}
          title='Halaman Pertama'
        >
          <ChevronsLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => setPage(Math.max(1, currentPage - 1))}
          disabled={!canPrev}
          title='Halaman Sebelumnya'
        >
          <ChevronLeft className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='h-8 w-8 p-0'
          onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
          disabled={!canNext}
          title='Halaman Selanjutnya'
        >
          <ChevronRight className='h-4 w-4' />
        </Button>
        <Button
          variant='outline'
          className='hidden h-8 w-8 p-0 lg:flex'
          onClick={() => setPage(totalPages)}
          disabled={!canNext}
          title='Halaman Terakhir'
        >
          <ChevronsRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  )
}
