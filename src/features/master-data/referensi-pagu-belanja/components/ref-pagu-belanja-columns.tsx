import { type ColumnDef } from '@tanstack/react-table'
import { type PaguBelanja } from '@/api'
import { cn, formatRupiah } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiPaguBelanjaColumns: ColumnDef<PaguBelanja>[] = [
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

  // ✅ nama Urusan
  {
    accessorKey: 'urusan.nm_urusan', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Urusan' />
    ),
    cell: ({ row }) => {
      const urusan = row.original.urusan
      return (
        <LongText className='max-w-300 ps-3'>
          {urusan?.nm_urusan ?? '-'}
        </LongText>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nama Bu
  {
    accessorKey: 'bu.nm_bu', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bidang Urusan' />
    ),
    cell: ({ row }) => {
      const bu = row.original.bu
      return <LongText className='max-w-300 ps-3'>{bu?.nm_bu ?? '-'}</LongText>
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nama program
  {
    accessorKey: 'program.nm_program', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Program' />
    ),
    cell: ({ row }) => {
      const program = row.original.program
      return (
        <LongText className='max-w-300 ps-3'>
          {program?.nm_program ?? '-'}
        </LongText>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nama kegiatan
  {
    accessorKey: 'kegiatan.nm_kegiatan', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kegiatan' />
    ),
    cell: ({ row }) => {
      const kegiatan = row.original.kegiatan
      return (
        <LongText className='max-w-300 ps-3'>
          {kegiatan?.nm_kegiatan ?? '-'}
        </LongText>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nama subkegiatan
  {
    accessorKey: 'subkegiatan.nm_subkegiatan', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sub Kegiatan' />
    ),
    cell: ({ row }) => {
      const subkegiatan = row.original.subkegiatan
      return (
        <LongText className='max-w-300 ps-3'>
          {subkegiatan?.nm_subkegiatan ?? '-'}
        </LongText>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nama rekening
  {
    accessorKey: 'rekening.nm_rekening', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rekening' />
    ),
    cell: ({ row }) => {
      const rekening = row.original.rekening
      return (
        <LongText className='max-w-300 ps-3'>
          {rekening?.nm_rekening ?? '-'}
        </LongText>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ pergeseran
  {
    accessorKey: 'kd_berapax',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pergeseran' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('kd_berapax')}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ jumlah pagu
  {
    accessorKey: 'jumlah_pagu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Pagu' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatRupiah(row.getValue('jumlah_pagu'))}
      </LongText>
    ),
    enableSorting: true,
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
