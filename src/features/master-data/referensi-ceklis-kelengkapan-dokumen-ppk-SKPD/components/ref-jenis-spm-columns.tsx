import { type ColumnDef } from '@tanstack/react-table'
import { type JenisSpm } from '@/api'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiJenisSpmColumns: ColumnDef<JenisSpm>[] = [
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

  // ✅ Kategori
  {
    accessorKey: 'kategori',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kategori' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('kategori')}</LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },
  // ✅ nama_berkas
  {
    accessorKey: 'nama_berkas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='nama berkas' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('nama_berkas')}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },
  // ✅ nama_berkas
  {
    accessorKey: 'status_penerimaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status Penerimaan' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status_penerimaan')

      const isActive = Number(status) === 1

      return (
        <span
          className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
            isActive
              ? 'bg-green-100 text-green-700 ring-1 ring-green-600/20'
              : 'bg-red-100 text-red-700 ring-1 ring-red-600/20'
          } `}
        >
          {isActive ? 'Aktif' : 'Tidak Aktif'}
        </span>
      )
    },
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
