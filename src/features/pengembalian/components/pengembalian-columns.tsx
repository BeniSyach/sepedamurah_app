import { type ColumnDef } from '@tanstack/react-table'
import { type Pengembalian } from '@/api'
import { cn, formatRupiah, formatTanggal } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'

export const ReferensiPengembalianColumns: ColumnDef<Pengembalian>[] = [
  // ✅ Checkbox selector
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: cn('sticky start-0 z-10 rounded-tl-[inherit] bg-background'),
    },
  },

  // ✅ Nomor Urut (tetap berlanjut antar halaman)
  {
    id: 'no',
    header: () => <div>No</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const number = pageIndex * pageSize + row.index + 1
      return <div>{number}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },

  // ✅ no_sts
  {
    accessorKey: 'tgl_rekam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Rekam' />
    ),
    cell: ({ row }) => <div>{formatTanggal(row.getValue('tgl_rekam'))}</div>,
    enableSorting: true,
  },

  // ✅ nik
  {
    accessorKey: 'nik',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NIK' />
    ),
    cell: ({ row }) => <div>{row.getValue('nik')}</div>,
    enableSorting: true,
  },

  // ✅ nama
  {
    accessorKey: 'nama',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: ({ row }) => <div>{row.getValue('nama')}</div>,
    enableSorting: true,
  },

  // ✅ alamat
  {
    accessorKey: 'alamat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Alamat' />
    ),
    cell: ({ row }) => <div>{row.getValue('alamat')}</div>,
    enableSorting: true,
  },

  // ✅ nama SKPD
  {
    accessorKey: 'nm_opd', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKPD' />
    ),
    cell: ({ row }) => {
      const skpd = row.original.skpd
      return <div>{skpd?.nm_opd ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ keterangan
  {
    accessorKey: 'keterangan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='keterangan' />
    ),
    cell: ({ row }) => <div>{row.getValue('keterangan')}</div>,
    enableSorting: true,
  },

  // ✅ nm_rekening
  {
    accessorKey: 'nm_rekening',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='nm_rekening' />
    ),
    cell: ({ row }) => <div>{row.getValue('nm_rekening')}</div>,
    enableSorting: true,
  },

  // ✅ jml_pengembalian
  {
    accessorKey: 'jml_pengembalian',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Pengembalian' />
    ),
    cell: ({ row }) => (
      <div>{formatRupiah(row.getValue('jml_pengembalian'))}</div>
    ),
    enableSorting: true,
  },

  // ✅ tgl_setor
  {
    accessorKey: 'tgl_setor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Setor' />
    ),
    cell: ({ row }) => <div>{formatTanggal(row.getValue('tgl_setor'))}</div>,
    enableSorting: true,
  },

  // ✅ jml_yg_disetor
  {
    accessorKey: 'jml_yg_disetor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Setor' />
    ),
    cell: ({ row }) => (
      <div>{formatRupiah(row.getValue('jml_yg_disetor'))}</div>
    ),
    enableSorting: true,
  },

  // ✅ status_bayar
  {
    accessorKey: 'status_bayar',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status Bayar' />
    ),
    cell: ({ row }) => <div>{row.getValue('status_bayar')}</div>,
    enableSorting: true,
  },
]
