import { type ColumnDef } from '@tanstack/react-table'
import { type UpSkpd } from '@/api'
import { cn, formatRupiah } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
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
    accessorKey: 'no',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No' />
    ),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const number = pageIndex * pageSize + row.index + 1
      return <div>{number}</div>
    },
    enableSorting: true,
    footer: () => <strong>Total</strong>,
  },

  // ✅ nama SKPD
  {
    accessorKey: 'skpd.nm_opd', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKPD' />
    ),
    cell: ({ row }) => {
      const skpd = row.original.skpd
      return <div>{skpd?.nm_opd ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ tahun
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun' />
    ),
    cell: ({ row }) => <div>{row.getValue('tahun')}</div>,
    enableSorting: true,
  },

  // ✅ pagu
  {
    accessorKey: 'pagu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='UP Tunai' />
    ),
    cell: ({ row }) => <div>{formatRupiah(row.getValue('pagu'))}</div>,
    enableSorting: true,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + Number(row.getValue('pagu') ?? 0), 0)

      return <div className='font-bold'>{formatRupiah(total)}</div>
    },
  },

  // ✅ up_kkpd
  {
    accessorKey: 'up_kkpd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='UP KKPD' />
    ),
    cell: ({ row }) => <div>{formatRupiah(row.getValue('up_kkpd'))}</div>,
    enableSorting: true,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue('up_kkpd') ?? 0),
          0
        )

      return <div className='font-bold'>{formatRupiah(total)}</div>
    },
  },
  {
    accessorKey: 'total', // karena ini hasil hitungan, bukan field dari API
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total UP' />
    ),
    cell: ({ row }) => {
      const pagu = Number(row.getValue('pagu')) || 0
      const upKkpd = Number(row.getValue('up_kkpd')) || 0
      const total = pagu + upKkpd

      return <div>{formatRupiah(total)}</div>
    },
    enableSorting: true, // tidak bisa sorting karena bukan kolom asli
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
        const pagu = Number(row.getValue('pagu')) || 0
        const upKkpd = Number(row.getValue('up_kkpd')) || 0
        return sum + (pagu + upKkpd)
      }, 0)

      return <div className='font-bold'>{formatRupiah(total)}</div>
    },
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
