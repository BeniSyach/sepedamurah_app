import { type ColumnDef } from '@tanstack/react-table'
import { type Kegiatan } from '@/api'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const refKegiatanColummns: ColumnDef<Kegiatan>[] = [
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
      const kd_keg1 = row.original.kd_keg1
      const kd_keg2 = row.original.kd_keg2
      const kd_keg3 = row.original.kd_keg3
      const kd_keg4 = row.original.kd_keg4
      const kd_keg5 = row.original.kd_keg5

      // Gabungkan dengan format, misal 1-02 (kd_keg2 di-padding 2 digit)
      const formatted = `${kd_keg1}.${kd_keg2}.${kd_keg3}.${kd_keg4}.${kd_keg5}`

      return <div>{formatted}</div>
    },
    enableSorting: false,
    meta: { className: 'min-w-[120px]' },
  },

  {
    accessorKey: 'nm_kegiatan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Kegiatan' />
    ),
    cell: ({ row }) => <div>{row.getValue('nm_kegiatan')}</div>,
    enableSorting: true,
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
