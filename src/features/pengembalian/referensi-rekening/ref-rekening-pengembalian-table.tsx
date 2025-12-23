/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from 'react'
import {
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import type { DatRekeningItem } from '@/api'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination, DataTableToolbar } from '@/components/data-table'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { RefRekeningPrimaryButtons } from './ref-rekening-pengembalian-buttons'
import { ReferensiDatRekeningItemColumns as columns } from './ref-rekening-pengembalian-columns'
import { UsersDialogs } from './ref-rekening-pengembalian-dialogs'
import { DatRekeningItemProvider } from './ref-rekening-pengembalian-provider'

type DataTableProps = {
  data: DatRekeningItem[]
  meta?: {
    current_page: number
    per_page: number
    total: number
  }

  search: string
  onSearchChange: (val: string) => void

  page: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export function DatRekeningItemTable({
  data,
  meta,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: DataTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [sorting, setSorting] = useState<SortingState>([])

  // HITUNG META
  const totalPages = meta ? Math.ceil(meta.total / meta.per_page) : 1

  const table = useReactTable({
    data,
    columns,
    pageCount: totalPages,
    manualPagination: true,
    state: {
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
      sorting,
      rowSelection,
      columnVisibility,
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === 'function'
          ? updater({ pageIndex: page - 1, pageSize })
          : updater

      onPageChange(next.pageIndex + 1)
      onPageSizeChange(next.pageSize)
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getPaginationRowModel: getPaginationRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <DatRekeningItemProvider>
      <div className='space-y-4'>
        <DataTableToolbar
          table={table}
          searchPlaceholder='Cari...'
          searchKey='nm_rekening'
          extraControls={<RefRekeningPrimaryButtons />}
          filters={[]}
        />

        {/* TABEL */}
        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
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
                    data-state={row.getIsSelected() ? 'selected' : undefined}
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

        {/* PAGINATION */}
        <DataTablePagination
          table={table}
          totalRows={meta?.total}
          currentPage={page}
          pageSize={pageSize}
          search={{}} // kosong karena state lokal
          navigate={({ search: newSearch }) => {
            const nextPage = (newSearch as any)?.page ?? page
            const nextPageSize = (newSearch as any)?.pageSize ?? pageSize

            onPageChange(nextPage)
            onPageSizeChange(nextPageSize)
          }}
        />

        <DataTableBulkActions table={table} />
      </div>

      <UsersDialogs />
    </DatRekeningItemProvider>
  )
}
