import { type ColumnDef } from '@tanstack/react-table'
import { type SumberDanaItem, type Sp2dItem } from '@/api'
import { cn, formatRupiah, formatTanggaldanJam } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
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
      <DataTableColumnHeader column={column} title='SKPD' />
    ),
    cell: ({ row }) => {
      const skpd = row.original.skpd
      return <div>{skpd?.nm_opd ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ no_spm
  {
    accessorKey: 'no_spm',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No SPM' />
    ),
    cell: ({ row }) => <div>{row.getValue('no_spm')}</div>,
    enableSorting: true,
  },

  // ✅ jenis_berkas
  {
    accessorKey: 'jenis_berkas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis Berkas' />
    ),
    cell: ({ row }) => <div>{row.getValue('jenis_berkas')}</div>,
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
    enableSorting: false, // bisa diubah jika mau sorting custom
  },

  // ✅ nama_file
  {
    accessorKey: 'nama_file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Uraian' />
    ),
    cell: ({ row }) => <div>{row.getValue('nama_file')}</div>,
    enableSorting: true,
  },

  // ✅ tanggal_upload
  {
    accessorKey: 'nilai_belanja',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Belanja' />
    ),
    cell: ({ row }) => <div>{formatRupiah(row.getValue('nilai_belanja'))}</div>,
    enableSorting: true,
    // 🔥 FOOTER untuk total
    footer: ({ table }) => {
      const total = table
        .getFilteredRowModel()
        .rows.reduce(
          (sum, row) => sum + Number(row.getValue('nilai_belanja') ?? 0),
          0
        )

      return <div className='font-bold'>{formatRupiah(total)}</div>
    },
  },

  // ✅ tanggal_upload
  {
    accessorKey: 'tanggal_upload',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Upload' />
    ),
    cell: ({ row }) => (
      <div>{formatTanggaldanJam(row.getValue('tanggal_upload'))}</div>
    ),
    enableSorting: true,
  },

  // ✅ status
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const diterima = row.original?.diterima
      const ditolak = row.original?.ditolak
      const alasanTolak = row.original?.alasan_tolak

      // 🔥 background ungu tapi tidak putih
      let color = 'bg-purple-300 text-purple-900'
      let text = 'Berkas terkirim'

      if (ditolak) {
        color = 'bg-red-100 text-red-800'
        text = `Berkas ditolak${alasanTolak ? `: ${alasanTolak}` : ''}`
      } else if (diterima) {
        color = 'bg-green-100 text-green-800'
        text = 'Berkas telah diverifikasi'
      }

      return <Badge className={`max-w-[300px] ps-3 ${color}`}>{text}</Badge>
    },
    enableSorting: true,
    meta: { className: 'min-w-[100px]' },
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
