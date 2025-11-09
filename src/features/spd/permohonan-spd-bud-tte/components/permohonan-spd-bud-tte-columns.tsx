import { format, parseISO } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type SpdTerkirim } from '@/api'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiPermohonanSpdColumns: ColumnDef<SpdTerkirim>[] = [
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
      const skpd = row.original.skpd
      return <div>{skpd?.nm_opd ?? '-'}</div>
    },
    enableSorting: true,
  },

  // ✅ nama_penerima
  {
    accessorKey: 'nama_penerima',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='nama_penerima' />
    ),
    cell: ({ row }) => <div>{row.getValue('nama_penerima')}</div>,
    enableSorting: true,
  },

  // ✅ nama_operator
  {
    accessorKey: 'nama_operator',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Operator' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('nama_operator') as string | null

      return (
        <div className='flex items-center gap-2 ps-3'>
          {value ? (
            <>
              <div className='max-w-300'>{value}</div>
              <Badge
                variant='secondary'
                className='bg-green-100 text-green-800 hover:bg-green-100'
              >
                Selesai
              </Badge>
            </>
          ) : (
            <Badge
              variant='secondary'
              className='bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
            >
              Sedang Memeriksa
            </Badge>
          )}
        </div>
      )
    },
    enableSorting: true,
  },

  // ✅ tanggal_upload
  {
    accessorKey: 'tanggal_upload',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tanggal Upload' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('tanggal_upload') as string
      if (!value) return '-'

      const parsedDate = parseISO(value.replace(' ', 'T'))
      const tanggal = format(parsedDate, 'dd-MM-yyyy')

      return <span className='ps-3'>{tanggal}</span>
    },
    enableSorting: true,
  },

  // ✅ jam_upload
  {
    id: 'jam_upload', // gunakan id, karena accessorKey-nya sama
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jam Upload' />
    ),
    cell: ({ row }) => {
      const value = row.getValue('tanggal_upload') as string
      if (!value) return '-'

      const parsedDate = parseISO(value.replace(' ', 'T'))
      const jam = format(parsedDate, 'HH:mm:ss')

      return <span className='ps-3'>{jam}</span>
    },
    enableSorting: false,
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
