import { type ColumnDef } from '@tanstack/react-table'
import { type BidangUrusan } from '@/api'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
// import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const refUursanColummns: ColumnDef<BidangUrusan>[] = [
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

  // ✅ Kode Referensi
  {
    id: 'kode_referensi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Referensi' />
    ),
    cell: ({ row }) => {
      // Ambil dua field dari data baris
      const kd_bu1 = row.original.kd_bu1
      const kd_bu2 = row.original.kd_bu2

      // Gabungkan dengan format, misal 1-02 (kd_bu2 di-padding 2 digit)
      const formatted = `${kd_bu1}.${kd_bu2.toString().padStart(2, '0')}`

      return <div>{formatted}</div>
    },
    enableSorting: false,
    meta: { className: 'min-w-[120px]' },
  },

  // ✅ Kode Referensi
  {
    accessorKey: 'nm_bu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Bidang Urusan' />
    ),
    cell: ({ row }) => <div>{row.getValue('nm_bu')}</div>,
    enableSorting: true,
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
