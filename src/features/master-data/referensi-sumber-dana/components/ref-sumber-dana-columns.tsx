import { type ColumnDef } from '@tanstack/react-table'
import { type SumberDana } from '@/api'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiSumberDanaColumns: ColumnDef<SumberDana>[] = [
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

  // ✅ Kode Referensi
  {
    id: 'kode_referensi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Referensi' />
    ),
    cell: ({ row }) => {
      // Ambil dua field dari data baris
      const kd_ref1 = row.original.kd_ref1
      const kd_ref2 = row.original.kd_ref2
      const kd_ref3 = row.original.kd_ref3
      const kd_ref4 = row.original.kd_ref4
      const kd_ref5 = row.original.kd_ref5
      const kd_ref6 = row.original.kd_ref6

      // Gabungkan dengan format, misal 1-02 (kd_ref2 di-padding 2 digit)
      const formatted = `${kd_ref1}-${kd_ref2}-${kd_ref3}-${kd_ref4}-${kd_ref5}-${kd_ref6}`

      return <div className='ps-3'>{formatted}</div>
    },
    enableSorting: false,
    meta: { className: 'min-w-[120px]' },
  },

  // ✅ nm_ref
  {
    accessorKey: 'nm_ref',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Sumber Dana' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('nm_ref')}</LongText>
    ),
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
