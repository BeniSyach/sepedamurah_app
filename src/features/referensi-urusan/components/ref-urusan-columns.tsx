import { type ColumnDef } from '@tanstack/react-table'
import { type Urusan } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const refUursanColummns: ColumnDef<Urusan>[] = [
  // ==========================
  // Kolom NO
  // ==========================
  {
    accessorKey: 'no',
    header: ({ column }) => (
      <div className='w-6 sm:w-10 md:w-12 lg:w-14'>
        <DataTableColumnHeader column={column} title='No' />
      </div>
    ),
    cell: ({ row, table }) => {
      const pageIndex = table.getState().pagination.pageIndex
      const pageSize = table.getState().pagination.pageSize
      const number = pageIndex * pageSize + row.index + 1
      return <div>{number}</div>
    },
    enableSorting: false,
  },

  // ==========================
  // Kolom KODE REFERENSI
  // ==========================
  {
    accessorKey: 'kd_urusan',
    header: ({ column }) => (
      <div className='w-12 sm:w-20 md:w-28 lg:w-32'>
        <DataTableColumnHeader column={column} title='Kode Referensi' />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue('kd_urusan')}</div>,
    enableSorting: true,
  },

  // ==========================
  // Kolom NAMA URUSAN (paling lebar & fleksibel)
  // ==========================
  {
    accessorKey: 'nm_urusan',
    header: ({ column }) => (
      <div className='min-w-[150px] sm:min-w-[250px] md:min-w-[350px] lg:min-w-[500px]'>
        <DataTableColumnHeader column={column} title='Nama Urusan' />
      </div>
    ),
    cell: ({ row }) => (
      <div className='break-words whitespace-normal'>
        {row.getValue('nm_urusan')}
      </div>
    ),
    enableSorting: true,
  },

  // ==========================
  // ACTION
  // ==========================
  {
    id: 'actions',
    header: () => <div className='w-4 sm:w-6 md:w-8' />,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
