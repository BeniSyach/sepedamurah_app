import { type ColumnDef } from '@tanstack/react-table'
import { type RealisasiTransferSumberDana } from '@/api'
import { cn, formatRupiah, formatTanggal } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiRealisasiTransferSumberDanaColumns: ColumnDef<RealisasiTransferSumberDana>[] =
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

    // ✅ nm_sumber
    {
      accessorKey: 'nm_sumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Nama Sumber Dana' />
      ),
      cell: ({ row }) => <div>{row.getValue('nm_sumber')}</div>,
      enableSorting: true,
      meta: { className: 'min-w-[160px]' },
    },

    // ✅ tgl_diterima
    {
      accessorKey: 'tgl_diterima',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tanggal Diterima' />
      ),
      cell: ({ row }) => (
        <div>{formatTanggal(row.getValue('tgl_diterima'))}</div>
      ),
      enableSorting: true,
      meta: { className: 'min-w-[160px]' },
    },

    // ✅ tahun
    {
      accessorKey: 'tahun',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tahun' />
      ),
      cell: ({ row }) => <div>{row.getValue('tahun')}</div>,
      enableSorting: true,
      meta: { className: 'min-w-[160px]' },
    },

    // ✅ jumlah
    {
      accessorKey: 'jumlah_sumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Jumlah' />
      ),
      cell: ({ row }) => (
        <div>{formatRupiah(row.getValue('jumlah_sumber'))}</div>
      ),
      enableSorting: true,
      meta: { className: 'min-w-[160px]' },
    },

    // // ✅ keterangan
    // {
    //   accessorKey: 'keterangan',
    //   header: ({ column }) => (
    //     <DataTableColumnHeader column={column} title='keterangan' />
    //   ),
    //   cell: ({ row }) => <div>{row.getValue('keterangan')}</div>,
    //   enableSorting: true,
    //   meta: { className: 'min-w-[160px]' },
    // },

    // ✅ keterangan_2
    {
      accessorKey: 'keterangan_2',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Keterangan' />
      ),
      cell: ({ row }) => <div>{row.getValue('keterangan_2')}</div>,
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
