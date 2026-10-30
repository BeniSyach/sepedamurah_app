import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import RangeDatePicker from '@/components/form-date-range'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Hash, RotateCcw, Filter } from 'lucide-react'
import { useSkpp } from './skpp-provider'

interface SkppToolbarProps {
  placeholder?: string
  datePlaceholder?: string
}

export function SkppToolbar({
  placeholder = 'Cari SKPP, nama, NIP, unit kerja, pembuat...',
  datePlaceholder = 'Filter rentang tanggal',
}: SkppToolbarProps) {
  const {
    search,
    setSearch,
    nomor,
    setNomor,
    jenisSkpp,
    setJenisSkpp,
    dateRange,
    setDateRange,
    setPage,
    meta,
  } = useSkpp()

  const hasActiveFilter = Boolean(
    search || nomor || jenisSkpp !== 'all' || dateRange.from || dateRange.to
  )

  const handleReset = () => {
    setSearch('')
    setNomor('')
    setJenisSkpp('all')
    setDateRange({ from: undefined, to: undefined })
    setPage(1)
  }

  return (
    <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between mb-4'>
      <div className='flex flex-wrap flex-1 items-center gap-2'>
        {/* Global Search */}
        <div className='relative w-full sm:w-60 md:w-72'>
          <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder={placeholder}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className='pl-8 h-9 text-xs sm:text-sm'
          />
        </div>

        {/* Filter Jenis SKPP */}
        <div className='w-full sm:w-36'>
          <Select
            value={jenisSkpp}
            onValueChange={(val) => {
              setJenisSkpp(val)
              setPage(1)
            }}
          >
            <SelectTrigger className='h-9 text-xs'>
              <div className='flex items-center gap-1.5 truncate'>
                <Filter className='w-3.5 h-3.5 text-muted-foreground shrink-0' />
                <SelectValue placeholder='Semua Jenis' />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='all' className='text-xs'>Semua Jenis</SelectItem>
              <SelectItem value='mutasi' className='text-xs'>SKPP Mutasi</SelectItem>
              <SelectItem value='pensiun' className='text-xs'>SKPP Pensiun</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Filter Nomor Surat */}
        <div className='relative w-full sm:w-40 md:w-48'>
          <Hash className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
          <Input
            placeholder='No. Surat (cth: 900/...)'
            value={nomor}
            onChange={(e) => {
              setNomor(e.target.value)
              setPage(1)
            }}
            className='pl-8 h-9 text-xs sm:text-sm'
          />
        </div>

        {/* Filter Rentang Tanggal */}
        <div className='w-full sm:w-auto'>
          <RangeDatePicker
            value={dateRange}
            onChange={(range) => {
              setDateRange(range ? { from: range.from, to: range.to } : { from: undefined, to: undefined })
              setPage(1)
            }}
            placeholder={datePlaceholder}
            className='h-9'
          />
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilter && (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={handleReset}
            className='h-9 px-2 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1'
          >
            <RotateCcw className='h-3.5 w-3.5' />
            <span>Reset Filter</span>
          </Button>
        )}
      </div>

      {/* Counter Total Data */}
      {meta && (
        <div className='text-xs text-muted-foreground self-start sm:self-center shrink-0'>
          Total: <span className='font-semibold text-foreground'>{meta.total}</span> dokumen
        </div>
      )}
    </div>
  )
}
