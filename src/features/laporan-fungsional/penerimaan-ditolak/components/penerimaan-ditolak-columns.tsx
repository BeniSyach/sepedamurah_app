import { type ColumnDef } from '@tanstack/react-table'
import { type LaporanFungsional } from '@/api'
import { cn, formatTanggal, getJam, getNamaBulan } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiLaporanFungsionalColumns: ColumnDef<LaporanFungsional>[] =
  [
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

    // ✅ Berkas Bulan
    {
      accessorKey: 'Berkas Bulan',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Bulan' />
      ),
      cell: ({ row }) => getNamaBulan(row.getValue('tanggal_upload')),
      enableSorting: true,
      meta: { className: 'min-w-[120px]' },
    },

    // ✅ Tanggal Upload
    {
      accessorKey: 'tanggal_upload',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tanggal Upload' />
      ),
      cell: ({ row }) => formatTanggal(row.getValue('tanggal_upload')),
      enableSorting: true,
      meta: { className: 'min-w-[120px]' },
    },

    // ✅ Jam Upload
    {
      accessorKey: 'Jam Upload',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Jam Upload' />
      ),
      cell: ({ row }) => getJam(row.getValue('tanggal_upload')),
      enableSorting: true,
      meta: { className: 'min-w-[120px]' },
    },

    // ✅ Keterangan
    {
      accessorKey: 'nama_file',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Keterangan' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-300 ps-3'>
          {row.getValue('nama_file')}
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
