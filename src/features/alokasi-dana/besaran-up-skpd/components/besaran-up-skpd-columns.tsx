import { type ColumnDef } from '@tanstack/react-table'
import { type UpSkpd } from '@/api'
import { cn, formatRupiah } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiUpSkpdColumns: ColumnDef<UpSkpd>[] = [
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

  // ✅ tahun
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='tahun' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('tahun')}</LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ pagu
  {
    accessorKey: 'pagu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='UP Tunai' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatRupiah(row.getValue('pagu'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ up_kkpd
  {
    accessorKey: 'up_kkpd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='UP KKPD' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatRupiah(row.getValue('up_kkpd'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },
  {
    id: 'total', // karena ini hasil hitungan, bukan field dari API
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total UP' />
    ),
    cell: ({ row }) => {
      const pagu = Number(row.getValue('pagu')) || 0
      const upKkpd = Number(row.getValue('up_kkpd')) || 0
      const total = pagu + upKkpd

      return (
        <LongText className='max-w-300 ps-3'>{formatRupiah(total)}</LongText>
      )
    },
    enableSorting: false, // tidak bisa sorting karena bukan kolom asli
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
