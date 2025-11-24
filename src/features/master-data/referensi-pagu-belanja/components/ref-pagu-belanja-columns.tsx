import { type ColumnDef } from '@tanstack/react-table'
import { type PaguBelanja } from '@/api'
import { cn, formatRupiah } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
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
      <DataTableColumnHeader column={column} title='SKPD' />
    ),
    cell: ({ row }) => {
      const skpd = row.original.skpd
      return <div>{skpd?.nm_opd ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ nama Urusan
  {
    accessorKey: 'urusan.nm_urusan', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Urusan' />
    ),
    cell: ({ row }) => {
      const urusan = row.original.urusan
      return <div>{urusan?.nm_urusan ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ nama Bu
  {
    accessorKey: 'bu.nm_bu', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='B.. Urusan' />
    ),
    cell: ({ row }) => {
      const bu = row.original.bu
      return <div>{bu?.nm_bu ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ nama program
  {
    accessorKey: 'program.nm_program', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Program' />
    ),
    cell: ({ row }) => {
      const program = row.original.program
      return <div>{program?.nm_program ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ nama kegiatan
  {
    accessorKey: 'kegiatan.nm_kegiatan', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kegiatan' />
    ),
    cell: ({ row }) => {
      const kegiatan = row.original.kegiatan
      return <div>{kegiatan?.nm_kegiatan ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ nama subkegiatan
  {
    accessorKey: 'subkegiatan.nm_subkegiatan', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SubKegiatan' />
    ),
    cell: ({ row }) => {
      const subkegiatan = row.original.subkegiatan
      return <div>{subkegiatan?.nm_subkegiatan ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ rekening
  {
    accessorKey: 'rekening.nm_rekening', // ganti key untuk akses nama SKPD
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rekening' />
    ),
    cell: ({ row }) => {
      const rekening = row.original.rekening
      return <div>{rekening?.nm_rekening ?? '-'}</div>
    },
    enableSorting: true,
  },

  // // ✅ pergeseran
  // {
  //   accessorKey: 'kd_berapax',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title='#' />,
  //   cell: ({ row }) => <div>{row.getValue('kd_berapax')}</div>,
  //   enableSorting: true,
  // },

  // ✅ jumlah pagu
  {
    accessorKey: 'jumlah_pagu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Pagu' />
    ),
    cell: ({ row }) => <div>{formatRupiah(row.getValue('jumlah_pagu'))}</div>,
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
