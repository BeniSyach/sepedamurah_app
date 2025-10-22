import { type ColumnDef } from '@tanstack/react-table'
import { type PaguSumberDana } from '@/api'
import { cn, formatRupiah, formatTanggalLengkap } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiPaguSumberDanaColumns: ColumnDef<PaguSumberDana>[] = [
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

  // ✅ Tanggal
  {
    accessorKey: 'tgl_rekam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatTanggalLengkap(row.getValue('tgl_rekam'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nama Suber Dana
  {
    accessorKey: 'skpd.nm_opd', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama SKPD' />
    ),
    cell: ({ row }) => {
      const sumber_dana = row.original.sumber_dana
      return (
        <LongText className='max-w-300 ps-3'>
          {sumber_dana?.nm_ref ?? '-'}
        </LongText>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ pagu
  {
    accessorKey: 'pagu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pagu' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatRupiah(row.getValue('pagu'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ jumlah_silpa
  {
    accessorKey: 'jumlah_silpa',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Silpa' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatRupiah(row.getValue('jumlah_silpa'))}
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
