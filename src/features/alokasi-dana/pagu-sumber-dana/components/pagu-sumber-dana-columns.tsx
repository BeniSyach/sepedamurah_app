import { type ColumnDef } from '@tanstack/react-table'
import { type PaguSumberDana } from '@/api'
import { cn, formatRupiah, formatTanggalLengkap } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
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

  // ✅ Tanggal
  {
    accessorKey: 'tgl_rekam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal' />
    ),
    cell: ({ row }) => (
      <div>{formatTanggalLengkap(row.getValue('tgl_rekam'))}</div>
    ),
    enableSorting: true,
  },

  // ✅ nama Suber Dana
  {
    accessorKey: 'sumber_dana.nm_ref', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sumber Dana' />
    ),
    cell: ({ row }) => {
      const sumber_dana = row.original.sumber_dana
      return <div>{sumber_dana?.nm_ref ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ pagu
  {
    accessorKey: 'pagu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pagu' />
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

  // ✅ jumlah_silpa
  {
    accessorKey: 'jumlah_silpa',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Silpa' />
    ),
    cell: ({ row }) => <div>{formatRupiah(row.getValue('jumlah_silpa'))}</div>,
    enableSorting: true,
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue('jumlah_silpa') ?? 0),
          0
        )

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
