import { type ColumnDef } from '@tanstack/react-table'
import { type Pengembalian } from '@/api'
import { cn, formatRupiah, formatTanggal } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'

export const ReferensiPengembalianColumns: ColumnDef<Pengembalian>[] = [
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

  // ✅ no_sts
  {
    accessorKey: 'tgl_rekam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Rekam' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatTanggal(row.getValue('tgl_rekam'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nik
  {
    accessorKey: 'nik',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='NIK' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('nik')}</LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nama
  {
    accessorKey: 'nama',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('nama')}</LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ alamat
  {
    accessorKey: 'alamat',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Alamat' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('alamat')}</LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
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

  // ✅ keterangan
  {
    accessorKey: 'keterangan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='keterangan' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('keterangan')}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ nm_rekening
  {
    accessorKey: 'nm_rekening',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='nm_rekening' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('nm_rekening')}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ jml_pengembalian
  {
    accessorKey: 'jml_pengembalian',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Pengembalian' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatRupiah(row.getValue('jml_pengembalian'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ tgl_setor
  {
    accessorKey: 'tgl_setor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Setor' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatTanggal(row.getValue('tgl_setor'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ jml_yg_disetor
  {
    accessorKey: 'jml_yg_disetor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Setor' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {formatRupiah(row.getValue('jml_yg_disetor'))}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },

  // ✅ status_bayar
  {
    accessorKey: 'status_bayar',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status Bayar' />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>
        {row.getValue('status_bayar')}
      </LongText>
    ),
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
  },
]
