import { type ColumnDef } from '@tanstack/react-table'
import { type BerkasLain } from '@/api'
import { cn, formatTanggal, getJam, getNamaBulan } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiBerkasLainColumns: ColumnDef<BerkasLain>[] = [
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
      const skpd = row.original.user.skpd
      return (
        <LongText className='max-w-300 ps-3'>{skpd?.nm_opd ?? '-'}</LongText>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ Berkas Bulan
  {
    accessorKey: 'Berkas Bulan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bulan' />
    ),
    cell: ({ row }) => getNamaBulan(row.getValue('tgl_surat')),
    enableSorting: true,
    meta: { className: 'min-w-[120px]' },
  },

  // ✅ tgl_surat
  {
    accessorKey: 'tgl_surat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Upload' />
    ),
    cell: ({ row }) => formatTanggal(row.getValue('tgl_surat')),
    enableSorting: true,
    meta: { className: 'min-w-[120px]' },
  },

  // ✅ tgl_surat
  {
    accessorKey: 'tgl_surat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jam Upload' />
    ),
    cell: ({ row }) => getJam(row.getValue('tgl_surat')),
    enableSorting: true,
    meta: { className: 'min-w-[120px]' },
  },

  // ✅ nama_dokumen
  {
    accessorKey: 'nama_dokumen',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Berkas' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('nama_dokumen')}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ status_tte dengan badge
  {
    accessorKey: 'status_tte',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue('status_tte')
      const isSigned = status === '1' // atau bisa status === 1 kalau tipe number

      return (
        <span
          className={`inline-block rounded-full px-2 py-1 text-xs font-semibold text-white ${
            isSigned ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isSigned ? 'Sudah Ditandatangani' : 'Belum Ditandatangani'}
        </span>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[200px]' },
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
