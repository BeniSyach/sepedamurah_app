/* eslint-disable no-console */
'use client'

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table'

/* eslint-disable no-console */

export type PengembalianDanaItem = {
  noSts: string
  tahun: number
  nik: string
  name: string
  rekening: string
  nilai: number
  keterangan: string
  tanggal: string
  status: string
}

type Props = {
  data: PengembalianDanaItem[]
}

export function PengembalianDanaTable({ data }: Props) {
  const columns: ColumnDef<PengembalianDanaItem>[] = [
    { header: 'NO STS', accessorKey: 'noSts' },
    { header: 'Tahun', accessorKey: 'tahun' },
    { header: 'NIK', accessorKey: 'nik' },
    { header: 'Nama', accessorKey: 'name' },
    { header: 'Rekening', accessorKey: 'rekening' },
    {
      header: 'Nilai',
      accessorKey: 'nilai',
      cell: (info) =>
        new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
        }).format(info.getValue() as number),
    },
    { header: 'Keterangan', accessorKey: 'keterangan' },
    { header: 'Tanggal', accessorKey: 'tanggal' },
    { header: 'Status', accessorKey: 'status' },
    {
      header: 'Aksi',
      accessorKey: 'aksi',
      cell: ({ row }) => (
        <div className='flex gap-2'>
          <Button
            size='sm'
            onClick={() => console.log('Cetak row', row.original.noSts)}
          >
            Cetak
          </Button>
          <Button
            size='sm'
            onClick={() => console.log('Lihat PDF row', row.original.noSts)}
          >
            Lihat PDF
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
    <div className='overflow-auto rounded-md border'>
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
  )
}
