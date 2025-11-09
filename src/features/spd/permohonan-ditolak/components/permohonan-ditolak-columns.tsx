import { format, parseISO } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type PermohonanSpd } from '@/api'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiPermohonanSpdColumns: ColumnDef<PermohonanSpd>[] = [
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
    cell: ({ row }) => <div>{row.getValue('nama_pengirim')}</div>,
    enableSorting: true,
    meta: { className: 'min-w-[160px]' },
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

      return <span>{tanggal}</span>
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

      return <span>{jam}</span>
    },
    enableSorting: false, // bisa diset true kalau mau
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

      return <Badge className={`ps-3 ${color}`}>{text}</Badge>
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
