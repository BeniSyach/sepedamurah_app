import { type ColumnDef } from '@tanstack/react-table'
import { type SumberDanaItem, type Sp2dItem } from '@/api'
import { formatRupiah, formatTanggaldanJam } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiSp2dItemColumns: ColumnDef<Sp2dItem>[] = [
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

  // ✅ no_spm
  {
    accessorKey: 'no_spm',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='no_spm' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('no_spm')}</LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ jenis_berkas
  {
    accessorKey: 'jenis_berkas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='jenis_berkas' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('jenis_berkas')}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
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

      return <LongText className='max-w-300 ps-3'>{names.join(', ')}</LongText>
    },
    enableSorting: false, // bisa diubah jika mau sorting custom
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nama_file
  {
    accessorKey: 'nama_file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Uraian Keperluan' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('nama_file')}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ tanggal_upload
  {
    accessorKey: 'nilai_belanja',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='nilai_belanja' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatRupiah(row.getValue('nilai_belanja'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ tanggal_upload
  {
    accessorKey: 'tanggal_upload',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal & waktu Terima' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatTanggaldanJam(row.getValue('tanggal_upload'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
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

      let color = 'bg-yellow-100 text-yellow-800'
      let text = 'Berkas sedang diproses'

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
    meta: { className: 'min-w-[220px]' },
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
