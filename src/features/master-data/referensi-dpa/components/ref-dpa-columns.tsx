import { type ColumnDef } from '@tanstack/react-table'
import { type RefDpa } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiRefDpaColumns: ColumnDef<RefDpa>[] = [
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

  // ✅ Kategori
  {
    accessorKey: 'nm_dpa',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Nama Dokumen Pelaksanaan Anggaran'
      />
    ),
    cell: ({ row }) => (
      <LongText className='max-w-300 ps-3'>{row.getValue('nm_dpa')}</LongText>
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
