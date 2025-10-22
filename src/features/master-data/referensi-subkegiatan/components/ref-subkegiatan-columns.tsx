import { type ColumnDef } from '@tanstack/react-table'
import { type SubKegiatan } from '@/api'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
// import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const refSubKegiatanColummns: ColumnDef<SubKegiatan>[] = [
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
      const kd_subkeg1 = row.original.kd_subkeg1
      const kd_subkeg2 = row.original.kd_subkeg2
      const kd_subkeg3 = row.original.kd_subkeg3
      const kd_subkeg4 = row.original.kd_subkeg4
      const kd_subkeg5 = row.original.kd_subkeg5
      const kd_subkeg6 = row.original.kd_subkeg6

      // Gabungkan dengan format, misal 1-02 (kd_subkeg2 di-padding 2 digit)
      const formatted = `${kd_subkeg1}-${kd_subkeg2}-${kd_subkeg3}-${kd_subkeg4}-${kd_subkeg5}-${kd_subkeg6}`

      return <div className='ps-3'>{formatted}</div>
    },
    enableSorting: false,
    meta: { className: 'min-w-[120px]' },
  },

  {
    accessorKey: 'nm_subkegiatan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Sub Kegiatan' />
    ),
    cell: ({ row }) => (
      <div className='truncate'>{row.getValue('nm_subkegiatan')}</div>
    ),
    enableSorting: true,
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
