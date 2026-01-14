import { type ColumnDef } from '@tanstack/react-table'
import { type RefRekonsiliasiGajiSkpd } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { LongText } from '@/components/long-text'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiRefRekonsiliasiGajiSkpdColumns: ColumnDef<RefRekonsiliasiGajiSkpd>[] =
  [
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
      accessorKey: 'nm_rekonsiliasi_gaji_skpd',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Nama Rekonsiliasi Gaji SKPD'
        />
      ),
      cell: ({ row }) => (
        <LongText className='max-w-300 ps-3'>
          {row.getValue('nm_rekonsiliasi_gaji_skpd')}
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
