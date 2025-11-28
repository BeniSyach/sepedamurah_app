import { type ColumnDef } from '@tanstack/react-table'
import { type SumberDanaItem, type Sp2dItem } from '@/api'
import { cn, formatRupiah, formatTanggaldanJam } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiSp2dItemColumns: ColumnDef<Sp2dItem>[] = [
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
    footer: () => <div className='font-bold'>Total</div>,
  },

  // ✅ nama SKPD
  {
    accessorKey: 'nm_opd', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bendahara SKPD' />
    ),
    cell: ({ row }) => {
      const skpd = row.original.skpd
      return <div>{skpd?.nm_opd ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ no_spm
  {
    accessorKey: 'namafile_sp2dkirim',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No SP2D' />
    ),
    accessorFn: (row) => row.sp2dkirim?.[0]?.namafile ?? '-',
    cell: ({ row }) => {
      const file = row.original.sp2dkirim?.[0]?.namafile ?? '-'
      return <div>{file}</div>
    },
    enableSorting: true, // sorting string nested? lebih aman disable
  },

  // ✅ tanggal_upload
  {
    accessorKey: 'diterima',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal & waktu Terima' />
    ),
    cell: ({ row }) => (
      <div>{formatTanggaldanJam(row.getValue('diterima'))}</div>
    ),
    enableSorting: true,
  },

  {
    accessorKey: 'sumber_dana',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sumber Dana' />
    ),
    cell: ({ row }) => {
      const sumberDana: SumberDanaItem[] = row.getValue('sumber_dana') || []

      // Ambil nama referensi dari setiap item
      const names = sumberDana.map((sd) => sd.referensi?.nm_ref).filter(Boolean) // buang null/undefined

      return <div>{names.join(', ')}</div>
    },
    enableSorting: true, // bisa diubah jika mau sorting custom
  },

  // ✅ tanggal_upload
  {
    accessorKey: 'nilai_belanja',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Belanja' />
    ),
    cell: ({ row }) => <div>{formatRupiah(row.getValue('nilai_belanja'))}</div>,
    enableSorting: true,
    footer: ({ table }) => {
      const rows = table.getRowModel().rows

      // hitung total nilai_belanja pada halaman aktif
      const total = rows.reduce((sum, row) => {
        const value = Number(row.getValue('nilai_belanja')) || 0
        return sum + value
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
