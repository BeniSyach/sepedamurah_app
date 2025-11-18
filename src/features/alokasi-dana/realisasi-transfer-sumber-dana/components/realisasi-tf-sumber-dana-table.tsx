/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { RekapSumberDanaItem } from '@/api'
import { toast } from 'sonner'
import { useSyncRealisasiTransferSumberDanaPajak } from '@/api/alokasi-dana/realisasi-transfer-sumber-dana/use-post-sumber-dana-pajak'
import { type NavigateFn } from '@/hooks/use-table-url-state'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTableToolbar } from '@/components/data-table'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { ReferensiRekapSumberDanaItemColumns as columns } from './realisasi-tf-sumber-dana-columns'

type DataTableProps = {
  data: RekapSumberDanaItem[]
  search: Record<string, unknown>
  navigate: NavigateFn
}

const bulanOptions = [
  { value: 1, label: 'Januari' },
  { value: 2, label: 'Februari' },
  { value: 3, label: 'Maret' },
  { value: 4, label: 'April' },
  { value: 5, label: 'Mei' },
  { value: 6, label: 'Juni' },
  { value: 7, label: 'Juli' },
  { value: 8, label: 'Agustus' },
  { value: 9, label: 'September' },
  { value: 10, label: 'Oktober' },
  { value: 11, label: 'November' },
  { value: 12, label: 'Desember' },
]
const currentMonth = new Date().getMonth() + 1

export function RekapTransferSumberDanaTable({
  data,
  search,
  navigate,
}: DataTableProps) {
  // Tahun diambil dari URL, default tahun sekarang
  const currentYear = new Date().getFullYear()
  const tahunFilter = Number(search.tahun ?? currentYear)
  const { mutateAsync } = useSyncRealisasiTransferSumberDanaPajak()
  // List tahun 3 tahun sebelum & 3 tahun sesudah
  const tahunOptions = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i)
  const bulanFilter = Number(search.bulan ?? currentMonth)
  // Update tahun → update URL → parent fetch ulang
  function changeTahun(value: number) {
    navigate({
      search: {
        ...search, // bawakan parameter lama
        tahun: value,
      },
    })
  }

  function changeBulan(value: number) {
    navigate({
      search: {
        ...search,
        bulan: value,
      },
    })
  }

  // table config
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})

  const table = useReactTable({
    data,
    columns: columns(bulanFilter),
    state: {
      rowSelection,
      columnVisibility,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  const handleExportSumberDanaPajak = async () => {
    await toast.promise(
      mutateAsync(), // memanggil hook mutation tanpa payload
      {
        loading: 'Sinkronisasi sedang berjalan...',
        success: () => 'Sinkronisasi berhasil!',
        error: (err) => `Sinkronisasi gagal: ${err.message || err}`,
      }
    )
  }

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Cari Realisasi Transfer Sumber Dana...'
        searchKey='nm_sumber'
        extraControls={
          <div className='flex items-center space-x-2'>
            <Select
              value={String(bulanFilter)}
              onValueChange={(v) => changeBulan(Number(v))}
            >
              <SelectTrigger className='w-[160px]'>
                <SelectValue placeholder='Bulan' />
              </SelectTrigger>
              <SelectContent>
                {bulanOptions.map((bln) => (
                  <SelectItem key={bln.value} value={String(bln.value)}>
                    {bln.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={String(tahunFilter)}
              onValueChange={(v) => changeTahun(Number(v))}
            >
              <SelectTrigger className='w-[140px]'>
                <SelectValue placeholder='Tahun' />
              </SelectTrigger>
              <SelectContent>
                {tahunOptions.map((th) => (
                  <SelectItem key={th} value={String(th)}>
                    Tahun {th}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Tombol Export */}
            <Button
              className='rounded-xl bg-blue-600 px-3 py-1 text-white hover:bg-blue-700'
              onClick={handleExportSumberDanaPajak} // fungsi export
            >
              sinkron Sumber Dana Pajak
            </Button>
          </div>
        }
      />

      {/* table */}
      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
            {table.getRowModel().rows.length ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='text-muted-foreground h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerGroup) => (
              <TableRow key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    className={
                      header.column.id === 'no' ? 'ps-3 font-semibold' : 'ps-3'
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>

      <DataTableBulkActions table={table} />
    </div>
  )
}
