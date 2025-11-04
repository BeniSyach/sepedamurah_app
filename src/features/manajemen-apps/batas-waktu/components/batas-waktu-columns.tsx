import { type ColumnDef } from '@tanstack/react-table'
import { type BatasWaktu } from '@/api'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiBatasWaktuColumns: ColumnDef<BatasWaktu>[] = [
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

  // ✅ nama SKPD
  {
    accessorKey: 'skpd.nm_opd', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama SKPD' />
    ),
    cell: ({ row }) => {
      const skpd = row.original.skpd
      return <div>{skpd?.nm_opd ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ hari
  {
    accessorKey: 'hari',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Hari' />
    ),
    cell: ({ row }) => <div>{row.getValue('hari')}</div>,
    enableSorting: true,
  },

  // ✅ waktu_awal
  {
    accessorKey: 'waktu_awal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Waktu Awal' />
    ),
    cell: ({ row }) => <div>{row.getValue('waktu_awal')}</div>,
    enableSorting: true,
  },

  // ✅ waktu_akhir
  {
    accessorKey: 'waktu_akhir',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Waktu Akhir' />
    ),
    cell: ({ row }) => <div>{row.getValue('waktu_akhir')}</div>,
    enableSorting: true,
  },

  // ✅ istirahat_awal
  {
    accessorKey: 'istirahat_awal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Istirahat Awal' />
    ),
    cell: ({ row }) => <div>{row.getValue('istirahat_awal')}</div>,
    enableSorting: true,
  },

  // ✅ istirahat_akhir
  {
    accessorKey: 'istirahat_akhir',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Istirahat Akhir' />
    ),
    cell: ({ row }) => <div>{row.getValue('istirahat_akhir')}</div>,
    enableSorting: true,
  },

  // ✅ keterangan
  {
    accessorKey: 'keterangan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Keterangan' />
    ),
    cell: ({ row }) => <div>{row.getValue('keterangan')}</div>,
    enableSorting: true,
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
