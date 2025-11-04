import { type ColumnDef } from '@tanstack/react-table'
import { type LogTTE } from '@/api'
import { cn, formatTanggaldanJam } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiLogTTEColumns: ColumnDef<LogTTE>[] = [
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

  // ✅ tgl_tte
  {
    accessorKey: 'tgl_tte',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='tgl_tte' />
    ),
    cell: ({ row }) => (
      <div>{formatTanggaldanJam(row.getValue('tgl_tte'))}</div>
    ),
    enableSorting: true,
  },

  // ✅ nama_penandatangan
  {
    accessorKey: 'nama_penandatangan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='nama_penandatangan' />
    ),
    cell: ({ row }) => <div>{row.getValue('nama_penandatangan')}</div>,
    enableSorting: true,
  },

  // ✅ kategori
  {
    accessorKey: 'kategori',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kategori' />
    ),
    cell: ({ row }) => <div>{row.getValue('kategori')}</div>,
    enableSorting: true,
  },

  // ✅ tte
  {
    accessorKey: 'tte',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='tte' />
    ),
    cell: ({ row }) => <div>{row.getValue('tte')}</div>,
    enableSorting: true,
  },

  // ✅ status
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='status' />
    ),
    cell: ({ row }) => <div>{row.getValue('status')}</div>,
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

  // ✅ message
  {
    accessorKey: 'message',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='message' />
    ),
    cell: ({ row }) => <div>{row.getValue('message')}</div>,
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
