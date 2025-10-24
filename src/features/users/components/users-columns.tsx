import { type ColumnDef } from '@tanstack/react-table'
import { type Users } from '@/api'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

// Mapping status (kamu bisa ubah sesuai kebutuhan backend)
const statusColor: Record<string, string> = {
  active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  inactive: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  suspended: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
}

export const usersColumns: ColumnDef<Users>[] = [
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
    header: () => <div className='w-12 text-center'>No</div>,
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const number = pageIndex * pageSize + row.index + 1
      return <div className='w-12 text-center'>{number}</div>
    },
    enableSorting: false,
    enableHiding: false,
  },

  // ✅ Nama
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-40 ps-3'>{row.getValue('name')}</LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ Email
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Email' />
    ),
    cell: ({ row }) => <div className='truncate'>{row.getValue('email')}</div>,
    enableSorting: true,
  },

  // ✅ nama SKPD
  {
    accessorKey: 'skpd.nm_opd', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama SKPD' />
    ),
    cell: ({ row }) => {
      const skpd = row.original.skpd
      return (
        <LongText className='max-w-300 ps-3'>{skpd?.nm_opd ?? '-'}</LongText>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ Level Akses / Role
  {
    accessorKey: 'access_level',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Level Akses' />
    ),
    cell: ({ row }) => (
      <Badge
        variant='secondary'
        className='bg-blue-100 text-blue-800 capitalize dark:bg-blue-900 dark:text-blue-100'
      >
        {row.getValue('access_level') || '-'}
      </Badge>
    ),
    enableSorting: false,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ Status aktif / nonaktif
  {
    accessorKey: 'is_active',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status =
        row.getValue<string>('is_active') === '1' ? 'active' : 'inactive'
      return (
        <Badge
          variant='outline'
          className={cn('capitalize', statusColor[status])}
        >
          {status}
        </Badge>
      )
    },
    enableSorting: false,
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
