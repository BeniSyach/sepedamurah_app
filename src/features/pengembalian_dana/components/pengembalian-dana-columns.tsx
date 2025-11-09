import { type ColumnDef } from '@tanstack/react-table'
import { type Pengembalian } from '@/api'
import { formatRupiah, formatTanggal } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DataTableColumnHeader } from '@/components/data-table'

export const PengembalianDanaColumns: ColumnDef<Pengembalian>[] = [
  { header: 'NO STS', accessorKey: 'no_sts' },
  { header: 'Tahun', accessorKey: 'tahun' },
  {
    accessorKey: 'nik',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NIK' />
    ),
    cell: ({ row }) => <div>{row.getValue('nik')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'nama',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: ({ row }) => <div>{row.getValue('nama')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'nm_rekening',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rekening' />
    ),
    cell: ({ row }) => <div>{row.getValue('nm_rekening')}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'jml_pengembalian',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai' />
    ),
    cell: ({ row }) => (
      <div>{formatRupiah(row.getValue('jml_pengembalian'))}</div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: 'keterangan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='keterangan' />
    ),
    cell: ({ row }) => <div>{row.getValue('keterangan')}</div>,
    enableSorting: true,
  },

  {
    accessorKey: 'tgl_rekam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Rekam' />
    ),
    cell: ({ row }) => <div>{formatTanggal(row.getValue('tgl_rekam'))}</div>,
    enableSorting: true,
  },
  {
    accessorKey: 'status_bayar',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status Bayar' />
    ),
    cell: ({ row }) => <div>{row.getValue('status_bayar')}</div>,
    enableSorting: true,
  },
  {
    header: 'Aksi',
    accessorKey: 'aksi',
    cell: ({ row }) => (
      <div className='flex gap-2'>
        <Button
          size='sm'
          onClick={() => console.log('Cetak row', row.original.no_sts)}
        >
          Cetak
        </Button>
        <Button
          size='sm'
          onClick={() => console.log('Lihat PDF row', row.original.no_sts)}
        >
          Lihat PDF
        </Button>
      </div>
    ),
  },
]
