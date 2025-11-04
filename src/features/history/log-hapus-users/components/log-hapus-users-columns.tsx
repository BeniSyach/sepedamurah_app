import { type ColumnDef } from '@tanstack/react-table'
import { type LogUsersHapus } from '@/api'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiLogUsersHapusColumns: ColumnDef<LogUsersHapus>[] = [
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

  // ✅ nama pengguna
  {
    accessorKey: 'user.name', // ganti key untuk akses nama user
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama pengguna' />
    ),
    cell: ({ row }) => {
      const user = row.original.user
      return <div>{user?.name ?? '-'}</div>
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ deleted_time
  {
    accessorKey: 'deleted_time',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='deleted_time' />
    ),
    cell: ({ row }) => <div>{row.getValue('deleted_time')}</div>,
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ deleted_by
  {
    accessorKey: 'deleted_by',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='deleted_by' />
    ),
    cell: ({ row }) => <div>{row.getValue('deleted_by')}</div>,
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ alasan
  {
    accessorKey: 'alasan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='alasan' />
    ),
    cell: ({ row }) => <div>{row.getValue('alasan')}</div>,
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
