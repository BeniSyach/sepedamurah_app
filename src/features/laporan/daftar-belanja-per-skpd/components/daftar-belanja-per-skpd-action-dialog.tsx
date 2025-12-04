/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import {
  type ColumnDef,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  type DetailDaftarBelanjaSKPDItem,
  useGetDetailDaftarBelanjaSKPD,
  type DaftarBelanjaSKPD,
} from '@/api'
import { FileSpreadsheet, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { formatRupiah, formatTanggaldanJam } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContentLarge } from '@/components/ui/dialog'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableFooter,
} from '@/components/ui/table'
import { DataTableToolbar } from '@/components/data-table'

/* eslint-disable @typescript-eslint/no-explicit-any */

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: DaftarBelanjaSKPD
}

export function DetailPerSKPD({ open, onOpenChange, currentRow }: Props) {
  const { data, isLoading } = useGetDetailDaftarBelanjaSKPD({
    kd_opd1: currentRow.kd_opd1,
    kd_opd2: currentRow.kd_opd2,
    kd_opd3: currentRow.kd_opd3,
    kd_opd4: currentRow.kd_opd4,
    kd_opd5: currentRow.kd_opd5,
    tahun: 2025,
  })

  const tahun = 2025

  const rows = data?.data ?? []

  // --- Table States ---
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})

  const columns: ColumnDef<DetailDaftarBelanjaSKPDItem>[] = [
    {
      header: 'Tanggal',
      accessorKey: 'tanggal',
      cell: ({ row }) => formatTanggaldanJam(row.original.tanggal),
    },
    {
      header: 'Sumber Dana',
      accessorKey: 'sumber_dana',
    },
    {
      header: 'Jenis Belanja',
      accessorKey: 'jenis_belanja',
    },
    {
      header: 'Jumlah',
      accessorKey: 'jumlah',
      cell: ({ row }) => formatRupiah(row.original.jumlah),
    },
  ]

  const table = useReactTable({
    data: rows,
    columns,
    state: {
      sorting,
      columnVisibility,
    },

    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const downloadExcel = async (params: any) => {
    await toast.promise(
      (async () => {
        const response = await api.get(
          '/laporan/daftar-belanja-skpd/download/excel',
          {
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            params: {
              ...params,
              t: Date.now(), // anti-cache
            },
          }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'DAFTAR-BELANJA.xlsx')
        document.body.appendChild(link)
        link.click()
        link.remove()
      })(),
      {
        loading: 'Mengunduh Excel...',
        success: 'Excel berhasil diunduh!',
        error: 'Gagal mengunduh Excel.',
      }
    )
  }

  const downloadPDF = async (params: any) => {
    await toast.promise(
      (async () => {
        const response = await api.get(
          '/laporan/daftar-belanja-skpd/download/pdf',
          {
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            params: {
              ...params,
              t: Date.now(),
            },
          }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', 'DAFTAR-BELANJA.pdf')
        document.body.appendChild(link)
        link.click()
        link.remove()
      })(),
      {
        loading: 'Mengunduh PDF...',
        success: 'PDF berhasil diunduh!',
        error: 'Gagal mengunduh PDF.',
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContentLarge title='Detail Belanja SKPD' description=''>
        <DataTableToolbar
          table={table}
          searchPlaceholder='Cari...'
          extraControls={
            <div className='flex items-center gap-2'>
              <Button
                className='space-x-1'
                onClick={() =>
                  downloadExcel({
                    tahun,
                    kd_opd1: currentRow.kd_opd1,
                    kd_opd2: currentRow.kd_opd2,
                    kd_opd3: currentRow.kd_opd3,
                    kd_opd4: currentRow.kd_opd4,
                    kd_opd5: currentRow.kd_opd5,
                  })
                }
              >
                <span>Export Excel</span> <FileSpreadsheet size={18} />
              </Button>

              <Button
                className='space-x-1'
                onClick={() =>
                  downloadPDF({
                    tahun,
                    kd_opd1: currentRow.kd_opd1,
                    kd_opd2: currentRow.kd_opd2,
                    kd_opd3: currentRow.kd_opd3,
                    kd_opd4: currentRow.kd_opd4,
                    kd_opd5: currentRow.kd_opd5,
                  })
                }
              >
                <span>Export PDF</span> <FileText size={18} />
              </Button>
            </div>
          }
        />
        <div className='mt-5 overflow-auto rounded-md border'>
          {isLoading ? (
            <div className='text-muted-foreground p-4 text-center'>
              Loading...
            </div>
          ) : (
            <>
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
                    table.getRowModel().rows.map((row) => (
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
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='text-muted-foreground h-24 text-center'
                      >
                        Tidak ada data
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>

                <TableFooter>
                  <TableRow>
                    <TableCell colSpan={columns.length}>
                      <div className='flex items-center justify-between py-2'>
                        {/* Info halaman */}
                        <div className='text-muted-foreground text-sm'>
                          Halaman {table.getState().pagination.pageIndex + 1}{' '}
                          dari {table.getPageCount()}
                        </div>

                        {/* Pagination */}
                        <div className='flex items-center space-x-1'>
                          {/* First Page */}
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => table.setPageIndex(0)}
                            disabled={
                              table.getState().pagination.pageIndex === 0
                            }
                          >
                            {'<<'}
                          </Button>

                          {/* Prev */}
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                          >
                            {'<'}
                          </Button>

                          {/* Window Pagination */}
                          {(() => {
                            const pageCount = table.getPageCount()
                            const current =
                              table.getState().pagination.pageIndex

                            const start = Math.max(0, current - 1)
                            const end = Math.min(pageCount - 1, current + 1)

                            const pages = []
                            for (let i = start; i <= end; i++) pages.push(i)

                            return (
                              <>
                                {/* Ellipsis before */}
                                {start > 0 && (
                                  <>
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() => table.setPageIndex(0)}
                                    >
                                      1
                                    </Button>
                                    {start > 1 && (
                                      <span className='text-muted-foreground px-1'>
                                        ...
                                      </span>
                                    )}
                                  </>
                                )}

                                {/* Visible pages */}
                                {pages.map((i) => (
                                  <Button
                                    key={i}
                                    size='sm'
                                    variant={
                                      current === i ? 'default' : 'outline'
                                    }
                                    onClick={() => table.setPageIndex(i)}
                                  >
                                    {i + 1}
                                  </Button>
                                ))}

                                {/* Ellipsis after */}
                                {end < pageCount - 1 && (
                                  <>
                                    {end < pageCount - 2 && (
                                      <span className='text-muted-foreground px-1'>
                                        ...
                                      </span>
                                    )}
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() =>
                                        table.setPageIndex(pageCount - 1)
                                      }
                                    >
                                      {pageCount}
                                    </Button>
                                  </>
                                )}
                              </>
                            )
                          })()}

                          {/* Next */}
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                          >
                            {'>'}
                          </Button>

                          {/* Last Page */}
                          <Button
                            size='sm'
                            variant='outline'
                            onClick={() =>
                              table.setPageIndex(table.getPageCount() - 1)
                            }
                            disabled={
                              table.getState().pagination.pageIndex ===
                              table.getPageCount() - 1
                            }
                          >
                            {'>>'}
                          </Button>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableFooter>
              </Table>
            </>
          )}
        </div>
      </DialogContentLarge>
    </Dialog>
  )
}
