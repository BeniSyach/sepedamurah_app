import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { FileSpreadsheet, Loader2 } from 'lucide-react'
import { skppColumns } from './skpp-columns'
import { useSkpp } from './skpp-provider'
import { SkppToolbar } from './skpp-toolbar'
import { SkppPagination } from './skpp-pagination'

export function SkppTable() {
  const { data, isLoading } = useSkpp()
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns: skppColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  })

  return (
    <div className='space-y-4'>
      {/* Search, Filter Tanggal, Filter Nomor Toolbar */}
      <SkppToolbar />

      {/* Table Container */}
      <div className='rounded-md border bg-card overflow-hidden'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='text-xs font-semibold uppercase'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={skppColumns.length}
                  className='h-36 text-center text-muted-foreground'
                >
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <Loader2 className='h-7 w-7 animate-spin text-primary' />
                    <p className='text-xs text-muted-foreground'>Memuat data SKPP dari server...</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='hover:bg-muted/50 transition-colors'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-3'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={skppColumns.length}
                  className='h-36 text-center text-muted-foreground'
                >
                  <div className='flex flex-col items-center justify-center gap-2'>
                    <FileSpreadsheet className='h-8 w-8 text-muted-foreground/50' />
                    <p className='font-medium'>Tidak ada data SKPP ditemukan</p>
                    <p className='text-xs text-muted-foreground'>
                      Silakan sesuaikan kata kunci pencarian, rentang tanggal, atau buat SKPP baru.
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Server-Side Pagination */}
        <SkppPagination />
      </div>
    </div>
  )
}
