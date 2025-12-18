/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import {
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { laporanBelanjaData } from '@/api'
import { cn } from '@/lib/utils'
import { type NavigateFn, useTableUrlState } from '@/hooks/use-table-url-state'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
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
import { ReferensiPengembalianColumns as columns } from './laporan-realisasi-belanja-columns'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string
  }
}

type DataTableProps = {
  data: laporanBelanjaData[]
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

export function PengembalianTable({ data, search, navigate }: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const currentYear = new Date().getFullYear()
  const tahunFilter = Number(search.tahun ?? currentYear)
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

  const { globalFilter, onGlobalFilterChange, pagination, onPaginationChange } =
    useTableUrlState({
      search,
      navigate,
      pagination: { defaultPage: 1, defaultPageSize: 10 },
      globalFilter: {
        enabled: true,
        key: 'search', // URL menjadi &filter=...
        trim: false,
      },
    })

  const table = useReactTable({
    data,
    columns: columns(bulanFilter),
    manualPagination: true,
    state: {
      pagination,
      rowSelection,
      globalFilter,
      columnVisibility,
    },
    onPaginationChange,
    onGlobalFilterChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Cari...'
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
          </div>
        }
      />

      <div className='overflow-hidden rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                      header.column.columnDef.meta?.className ?? ''
                    )}
                  >
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className='group/row'
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        'bg-background group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted',
                        cell.column.columnDef.meta?.className ?? ''
                      )}
                    >
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
    </div>
  )
}
