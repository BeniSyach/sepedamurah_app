import { type ColumnDef } from '@tanstack/react-table'
import { type BerkasLain } from '@/api'
import { cn, formatTanggal, getJam, getNamaBulan } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
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

  // ✅ nama SKPD
  {
    accessorKey: 'skpd.nm_opd', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama SKPD' />
    ),
    cell: ({ row }) => {
      const skpd = row.original.user.skpd
      return <div>{skpd?.nm_opd ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ Berkas Bulan
  {
    accessorKey: 'Berkas Bulan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bulan' />
    ),
    cell: ({ row }) => getNamaBulan(row.getValue('tgl_surat')),
    enableSorting: true,
  },

  // ✅ tgl_surat
  {
    accessorKey: 'tgl_surat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Upload' />
    ),
    cell: ({ row }) => formatTanggal(row.getValue('tgl_surat')),
    enableSorting: true,
  },

  // ✅ tgl_surat
  {
    accessorKey: 'tgl_surat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jam Upload' />
    ),
    cell: ({ row }) => getJam(row.getValue('tgl_surat')),
    enableSorting: true,
  },

  // ✅ nama_dokumen
  {
    accessorKey: 'nama_dokumen',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Berkas' />
    ),
    cell: ({ row }) => <div>{row.getValue('nama_dokumen')}</div>,
    enableSorting: true,
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
          className={`inline-block rounded-full px-2 py-1 text-center text-xs font-semibold text-white ${
            isSigned ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {isSigned ? 'Sudah Ditandatangani' : 'Belum Ditandatangani'}
        </span>
      )
    },
    enableSorting: true,
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
