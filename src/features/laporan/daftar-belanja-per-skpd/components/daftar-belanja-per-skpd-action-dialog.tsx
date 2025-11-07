'use client'

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { Dialog, DialogContentLarge } from '@/components/ui/dialog'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from '@/components/ui/table'
import { type PengembalianDanaItem } from '@/features/pengembalian_dana/components/pengembalian-dana-table-'

// Contoh data sementara
const data: PengembalianDanaItem[] = [
  {
    noSts: '001/STS/2025',
    nik: '1234567890123456',
    name: 'Beni Syach',
    nilai: 1000000,
    keterangan: 'Pengembalian Dana',
    tanggal: '26-10-2025',
    status: 'Selesai',
    rekening: '5.2.1.01.01 - Belanja Barang',
    tahun: 2025,
  },
]

type UserActionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DetailPerSKPD({ open, onOpenChange }: UserActionDialogProps) {
  const columns: ColumnDef<PengembalianDanaItem>[] = [
    { header: 'Tanggal', accessorKey: 'noSts' },
    { header: 'Sumber Dana', accessorKey: 'tahun' },
    { header: 'Jenis Belanja', accessorKey: 'nik' },
    { header: 'Jumlah', accessorKey: 'name' },
  ]

  const table = useReactTable({
    data, // semua data langsung
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        onOpenChange(state)
      }}
    >
      <DialogContentLarge title='Detail Belanja SKPD' description=''>
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
      </DialogContentLarge>
    </Dialog>
  )
}
