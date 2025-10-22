import { type ColumnDef } from '@tanstack/react-table'
import { type LaporanFungsional } from '@/api'
import { cn } from '@/lib/utils'
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

    // ✅ nama_pengirim
    {
      accessorKey: 'nama_pengirim',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='nama_pengirim' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-300 ps-3'>
          {row.getValue('nama_pengirim')}
        </LongText>
      ),
      enableSorting: true,
      meta: { className: 'min-w-[160px]' },
    },

    // ✅ tanggal_upload
    {
      accessorKey: 'tanggal_upload',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='tanggal_upload' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-300 ps-3'>
          {row.getValue('tanggal_upload')}
        </LongText>
      ),
      enableSorting: true,
      meta: { className: 'min-w-[160px]' },
    },

    // ✅ nama_operator
    {
      accessorKey: 'nama_operator',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='nama_operator' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-300 ps-3'>
          {row.getValue('nama_operator')}
        </LongText>
      ),
      enableSorting: true,
      meta: { className: 'min-w-[160px]' },
    },

    // ✅ nama_file
    {
      accessorKey: 'nama_file',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='nama_file' />
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
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='status' />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-300 ps-3'>{row.getValue('status')}</LongText>
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
