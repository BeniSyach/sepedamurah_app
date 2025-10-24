import { type ColumnDef } from '@tanstack/react-table'
import { type MasterSkpd } from '@/api'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiMasterSkpdColumns: ColumnDef<MasterSkpd>[] = [
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
      const kd_opd1 = row.original.kd_opd1
      const kd_opd2 = row.original.kd_opd2
      const kd_opd3 = row.original.kd_opd3
      const kd_opd4 = row.original.kd_opd4
      const kd_opd5 = row.original.kd_opd5

      // Gabungkan dengan format, misal 1-02 (kd_subkeg2 di-padding 2 digit)
      const formatted = `${kd_opd1}.${kd_opd2}.${kd_opd3}.${kd_opd4}.${kd_opd5}`

      return <div className='ps-3'>{formatted}</div>
    },
    enableSorting: false,
    meta: { className: 'min-w-[120px]' },
  },

  // ✅ nm_opd
  {
    accessorKey: 'nm_opd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama SKPD' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('nm_opd')}</LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ status_penerimaan
  {
    accessorKey: 'status_penerimaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Penerimaan' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('status_penerimaan')

      const isAda = String(value) === '1'
      const text = isAda ? 'Ada Penerimaan' : 'Tidak Ada Penerimaan'
      const badgeClass = isAda
        ? 'bg-blue-100 text-blue-700 border border-blue-300'
        : 'bg-yellow-100 text-yellow-700 border border-yellow-300'

      return (
        <div className='flex items-center ps-3'>
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${badgeClass}`}
          >
            {text}
          </span>
        </div>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ status
  {
    accessorKey: 'hidden',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('hidden')

      const isActive = Number(status) === 0

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
