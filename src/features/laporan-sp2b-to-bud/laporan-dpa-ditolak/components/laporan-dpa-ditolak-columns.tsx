import { type ColumnDef } from '@tanstack/react-table'
import { type LaporanSp2bToBUD } from '@/api'
import { cn, formatTanggal, getJam, getNamaBulan } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiLaporanSp2bToBUDColumns: ColumnDef<LaporanSp2bToBUD>[] = [
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

  // ✅ Berkas Bulan
  {
    accessorKey: 'Berkas Bulan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bulan' />
    ),
    cell: ({ row }) => getNamaBulan(row.getValue('created_at')),
    enableSorting: true,
  },

  // ✅ Tanggal Upload
  {
    accessorKey: 'created_at',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Upload' />
    ),
    cell: ({ row }) => formatTanggal(row.getValue('created_at')),
    enableSorting: true,
  },

  // ✅ Jam Upload
  {
    accessorKey: 'Jam Upload',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jam Upload' />
    ),
    cell: ({ row }) => getJam(row.getValue('created_at')),
    enableSorting: true,
  },

  // ✅ Keterangan
  {
    accessorKey: 'nama_file',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis Asset Bendahara' />
    ),
    cell: ({ row }) => {
      const jenis_dpa = row.original?.refSp2bKeBud?.nm_sp2b_ke_bud
      return <div>{jenis_dpa}</div>
    },
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

      let color =
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
      let text = 'Berkas sedang diproses'

      if (ditolak) {
        color = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100'
        text = `Berkas ditolak${alasanTolak ? `: ${alasanTolak}` : ''}`
      } else if (diterima) {
        color =
          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100'
        text = 'Berkas telah diverifikasi'
      }

      return (
        <div className='ps-3'>
          <div
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-center text-xs font-medium ${color}`}
          >
            {text}
          </div>
        </div>
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
