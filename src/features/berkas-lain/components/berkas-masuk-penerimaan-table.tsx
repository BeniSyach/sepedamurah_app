/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { BerkasLain } from '@/api'
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
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { ReferensiBerkasLainColumns as columns } from './berkas-masuk-penerimaan-columns'
import { DataTableBulkActions } from './data-table-bulk-actions'

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData, TValue> {
    className?: string
  }
}

type DataTableProps = {
  data: BerkasLain[]
  meta?: {
    current_page: number
    per_page: number
    total: number
  }
  search: Record<string, unknown>
  navigate: NavigateFn
}

export function BerkasLainTable({
  data,
  meta,
  search,
  navigate,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])
  const currentYear = new Date().getFullYear()
  const tahunFilter = Number(search.tahun ?? currentYear)
  const tahunOptions = Array.from({ length: 7 }, (_, i) => currentYear - 3 + i)

  function changeTahun(value: number) {
    navigate({
      search: {
        ...search, // bawakan parameter lama
        tahun: value,
      },
    })
  }

  const {
    globalFilter,
    onGlobalFilterChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  } = useTableUrlState({
    search,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: {
      enabled: true,
      key: 'nama_dokumen', // URL menjadi &filter=...
      trim: false,
    },
  })

  const totalRows = meta?.total ?? data.length
  const totalPages = meta ? Math.ceil(meta.total / meta.per_page) : 1
  const currentPage = meta?.current_page ?? pagination.pageIndex + 1

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true, // ⬅️ penting!
    state: {
      sorting,
      pagination,
      rowSelection,
      globalFilter,
      columnVisibility,
    },
    onSortingChange: (updater) => {
      const nextSorting =
        typeof updater === 'function' ? updater(sorting) : updater

      setSorting(nextSorting)

      const sort = nextSorting[0]

      navigate({
        search: {
          ...search,
          sort_by: sort?.id ?? undefined,
          sort_dir: sort?.desc ? 'desc' : 'asc',
        },
      })
    },
    onPaginationChange,
    onGlobalFilterChange,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    ensurePageInRange(totalPages)
  }, [totalPages, ensurePageInRange])

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <DataTableToolbar
        table={table}
        searchPlaceholder='Cari...'
        extraControls={
          <div className='flex items-center space-x-2'>
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
        </Table>
      </div>

      <DataTablePagination
        table={table}
        totalRows={totalRows}
        currentPage={currentPage}
        pageSize={meta?.per_page ?? pagination.pageSize}
        search={search} // 🔥 WAJIB
        navigate={navigate} // 🔥 WAJIB
      />

      <DataTableBulkActions table={table} />
    </div>
  )
}
