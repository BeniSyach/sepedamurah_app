import { type ColumnDef } from '@tanstack/react-table'
import { type Rekening } from '@/api'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiRekeningColumns: ColumnDef<Rekening>[] = [
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
      const kd_rekening1 = row.original.kd_rekening1
      const kd_rekening2 = row.original.kd_rekening2
      const kd_rekening3 = row.original.kd_rekening3
      const kd_rekening4 = row.original.kd_rekening4
      const kd_rekening5 = row.original.kd_rekening5
      const kd_rekening6 = row.original.kd_rekening6

      // Gabungkan dengan format, misal 1-02 (kd_subkeg2 di-padding 2 digit)
      const formatted = `${kd_rekening1}.${kd_rekening2}.${kd_rekening3}.${kd_rekening4}.${kd_rekening5}.${kd_rekening6}`

      return <div className='ps-3'>{formatted}</div>
    },
    enableSorting: false,
    meta: { className: 'min-w-[120px]' },
  },

  // ✅ Nama
  {
    accessorKey: 'nm_rekening',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Rekening' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('nm_rekening')}
      </LongText>
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
