import { useState } from 'react'
import { startOfMonth, endOfMonth } from 'date-fns'
import { getRouteApi } from '@tanstack/react-router'
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
// import { toast } from 'sonner'
// import { useSyncRealisasiTransferSumberDanaPajak } from '@/api/alokasi-dana/realisasi-transfer-sumber-dana/use-post-sumber-dana-pajak'
import { useTableUrlState, type NavigateFn } from '@/hooks/use-table-url-state'
// import { Button } from '@/components/ui/button'
// import {
//   Select,
//   SelectTrigger,
//   SelectContent,
//   SelectItem,
//   SelectValue,
// } from '@/components/ui/select'
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
import RangeDatePicker from '@/components/form-date-range'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { ReferensiRekapSumberDanaItemColumns as columns } from './realisasi-tf-sumber-dana-columns'

const route = getRouteApi(
  '/_authenticated/alokasi-dana/realisasi-transfer-sumber-dana'
)

type DataTableProps = {
  data: RekapSumberDanaItem[]
  search: Record<string, unknown>
  navigate: NavigateFn
  dateRange?: { from?: Date; to?: Date }
  onDateRangeChange?: (range: { from?: Date; to?: Date }) => void
}

const currentMonth = new Date().getMonth() + 1

export function RekapTransferSumberDanaTable({
  data,
  search,
  navigate,
  dateRange,
  onDateRangeChange,
}: DataTableProps) {
  // Tahun diambil dari URL, default tahun sekarang
  // const currentYear = new Date().getFullYear()
  // const tahunFilter = Number(search.tahun ?? currentYear)
  // const { mutateAsync } = useSyncRealisasiTransferSumberDanaPajak()
  // List tahun 3 tahun sebelum & 3 tahun sesudah
  // const tahunOptions = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i)
  const bulanFilter = Number(search.bulan ?? currentMonth)
  // Update tahun → update URL → parent fetch ulang
  // function changeTahun(value: number) {
  //   navigate({
  //     search: {
  //       ...search, // bawakan parameter lama
  //       tahun: value,
  //     },
  //   })
  // }

  // function changeBulan(value: number) {
  //   navigate({
  //     search: {
  //       ...search,
  //       bulan: value,
  //     },
  //   })
  // }

  // table config
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState({})

  const { globalFilter } = useTableUrlState({
    search: route.useSearch(),
    navigate: route.useNavigate(),
  })

  const table = useReactTable({
    data,
    columns: columns(bulanFilter),
    state: {
      rowSelection,
      columnVisibility,
      globalFilter,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    onGlobalFilterChange: (value) => {
      navigate({
        search: (prev) => ({
          ...prev,
          search: value, // ✅ JANGAN trim
        }),
      })
    },
    globalFilterFn: (row, _, filterValue) => {
      const keywords = String(filterValue).toLowerCase().trim().split(/\s+/) // 🔥 pecah berdasarkan spasi

      return keywords.every((keyword) =>
        row.getAllCells().some((cell) => {
          const raw = cell.getValue()
          const value = Number(raw)

          // support > dan <
          if (!isNaN(value)) {
            if (keyword.startsWith('>')) {
              return value > Number(keyword.slice(1))
            }
            if (keyword.startsWith('<')) {
              return value < Number(keyword.slice(1))
            }
          }

          return String(raw ?? '')
            .toLowerCase()
            .includes(keyword)
        })
      )
    },
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Cari Realisasi Transfer Sumber Dana...'
        searchKey={undefined}
        extraControls={
          <div className='flex items-center space-x-2'>
            {/* <Select
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
            </Select> */}
            <RangeDatePicker
              value={{
                from: dateRange?.from ?? startOfMonth(new Date()),
                to: dateRange?.to ?? endOfMonth(new Date()),
              }}
              onChange={(range) => {
                if (!range?.from) return

                const tahun = range.from.getFullYear()
                const bulan = range.from.getMonth() + 1

                navigate({
                  search: {
                    ...search, // parameter lama tetap
                    tahun,
                    bulan,
                  },
                })

                onDateRangeChange?.({
                  from: range.from,
                  to: range.to ?? undefined,
                })
              }}
              placeholder='Filter tanggal'
            />

            {/* <Select
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
            </Select> */}

            {/* Tombol Export */}
            {/* <Button
              className='rounded-xl bg-blue-600 px-3 py-1 text-white hover:bg-blue-700'
              onClick={handleExportSumberDanaPajak} // fungsi export
            >
              sinkron Sumber Dana Pajak
            </Button> */}
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
                {table.getRowModel().rows.map((row) => {
                  // Cek apakah baris ini memiliki nilai negatif
                  const total = row.getValue<number>('sd_bulan_ini') ?? 0
                  const isNegative = total < 0

                  return (
                    <TableRow
                      key={row.id}
                      className={isNegative ? 'bg-red-500 text-white' : ''}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllLeafColumns().length}
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
