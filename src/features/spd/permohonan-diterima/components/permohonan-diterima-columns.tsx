import { format, parseISO } from 'date-fns'
import { type ColumnDef } from '@tanstack/react-table'
import { type PermohonanSpd } from '@/api'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

const levelAkses = localStorage.getItem('user_role')

export const ReferensiPermohonanSpdColumns: ColumnDef<PermohonanSpd>[] = [
  // ✅ Nomor Urut (tetap berlanjut antar halaman)

  {
    accessorKey: 'no',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No' />
    ),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const number = pageIndex * pageSize + row.index + 1
      return <div>{number}</div>
    },
    enableSorting: true,
  },

  // ✅ nama_pengirim
  {
    id: 'nama_pengirim',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Pengirim' />
    ),
    cell: ({ row }) => {
      const pengirim = row.original.nama_pengirim
      const penerima = row.original.nama_penerima

      return (
        <div>{pengirim && pengirim.trim() !== '' ? pengirim : penerima}</div>
      )
    },
    enableSorting: true,
  },
  // ✅ nama_pengirim
  {
    id: 'nm_opd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Pengirim' />
    ),
    cell: ({ row }) => {
      const nm_opd = row.original.nm_opd

      return <div>{nm_opd}</div>
    },
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
    accessorKey: 'jam_upload', // gunakan id, karena accessorKey-nya sama
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
    enableSorting: true, // bisa diset true kalau mau
  },

  // ✅ CONDITIONAL COLUMN (AMAN)
  ...(levelAkses !== 'Bendahara'
    ? [
        {
          accessorKey: 'publish',
          header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Publish' />
          ),
          cell: ({ row }) => {
            const publish = row.original?.publish

            const isPublished = publish === '1'

            const color = isPublished
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'

            const text = isPublished
              ? 'SPD sudah dipublish'
              : 'SPD belum dipublish'

            return (
              <Badge className={`max-w-[300px] ps-3 ${color}`}>{text}</Badge>
            )
          },
        } as ColumnDef<PermohonanSpd>,
      ]
    : []),

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
      const tte = row.original?.status

      let color = 'bg-yellow-100 text-yellow-800'
      let text = 'Berkas sedang diproses'

      if (ditolak) {
        color = 'bg-red-100 text-red-800'
        text = `Berkas ditolak${alasanTolak ? `: ${alasanTolak}` : ''}`
      } else if (diterima) {
        color = 'bg-green-100 text-green-800'
        text = 'Berkas telah diverifikasi'
      } else if (tte == '1') {
        color = 'bg-green-100 text-green-800'
        text = 'Berkas telah diverifikasi'
      }

      return <Badge className={`max-w-[300px] ps-3 ${color}`}>{text}</Badge>
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
