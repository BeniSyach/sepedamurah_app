'use client'

import {
  type CellContext,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { type Pengembalian } from '@/api'
import { Button } from '@/components/ui/button.tsx'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table'
import { PengembalianDanaColumns as baseColumns } from './pengembalian-dana-columns.tsx'

type Props = {
  data: Pengembalian[]
}

export function PengembalianDanaTable({ data }: Props) {
  const handleCetak = (row: Pengembalian) => {
    const params = new URLSearchParams({
      nik: row.nik,
      nama: row.nama,
      penyetor: row.nama,
      alamat: row.alamat,
      rekening: row.nm_rekening || '', // pastikan string
      keterangan: row.keterangan || '', // pastikan string
      jumlah: String(row.jml_pengembalian),
      no_billing: row.no_sts || '', // pastikan string
    }).toString()
    const API_URL = import.meta.env.VITE_API_URL
    const url = `${API_URL}/pengembalian/download?${params}`
    window.open(url, '_blank')
  }

  const handleDownload = (row: Pengembalian) => {
    const params = new URLSearchParams({
      nik: row.nik,
      nama: row.nama,
      penyetor: row.nama,
      alamat: row.alamat,
      rekening: row.nm_rekening || '',
      keterangan: row.keterangan || '',
      jumlah: String(row.jml_pengembalian),
      no_billing: row.no_sts || '',
    }).toString()
    const API_URL = import.meta.env.VITE_API_URL
    const url = `${API_URL}/pengembalian/download?${params}`
    const link = document.createElement('a')
    link.href = url
    link.download = `pengembalian_${row.no_sts || 'file'}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const columns = [
    ...baseColumns,
    {
      header: 'Aksi',
      accessorKey: 'aksi',
      cell: (cell: CellContext<Pengembalian, unknown>) => (
        <div className='flex gap-2'>
          <Button size='sm' onClick={() => handleCetak(cell.row.original)}>
            Cetak
          </Button>
          <Button size='sm' onClick={() => handleDownload(cell.row.original)}>
            Unduh PDF
          </Button>
        </div>
      ),
    },
  ]

  const table = useReactTable({
    data, // semua data langsung
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className='space-y-4 max-sm:has-[div[role="toolbar"]]:mb-16'>
      <div className='overflow-auto rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='group/row'>
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
        </Table>
      </div>
    </div>
  )
}
