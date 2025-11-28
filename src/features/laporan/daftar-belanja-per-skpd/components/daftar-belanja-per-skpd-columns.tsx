import { type ColumnDef } from '@tanstack/react-table'
import { type DaftarBelanjaSKPD } from '@/api'
import { formatRupiah } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const DaftarBelanjaPerSKPDColumns: ColumnDef<DaftarBelanjaSKPD>[] = [
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
    footer: () => null,
  },

  // ✅ Kode Referensi
  {
    id: 'kode_referensi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode SKPD' />
    ),
    cell: ({ row }) => {
      // Ambil dua field dari data baris
      const kd_opd1 = row.original.kd_opd1
      const kd_opd2 = row.original.kd_opd2
      const kd_opd3 = row.original.kd_opd3
      const kd_opd4 = row.original.kd_opd4
      const kd_opd5 = row.original.kd_opd5

      // Gabungkan dengan format, misal 1-02 (kd_ref2 di-padding 2 digit)
      const formatted = `${kd_opd1}.${kd_opd2}.${kd_opd3}.${kd_opd4}.${kd_opd5}`

      return <div>{formatted}</div>
    },
    enableSorting: false,

    footer: () => 'TOTAL',
  },

  // ✅ nama Sumber Dana
  {
    accessorKey: 'nm_opd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKPD' />
    ),
    cell: ({ row }) => <div>{row.getValue('nm_opd')}</div>,
    enableSorting: true,
    footer: () => null,
  },

  // ✅ pagu
  {
    accessorKey: 'jum_belanja',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Belanja' />
    ),
    cell: ({ row }) => <div>{formatRupiah(row.getValue('jum_belanja'))}</div>,
    footer: (props) => {
      const total = props.table
        .getFilteredRowModel()
        .rows.reduce((sum, row) => sum + Number(row.getValue('jum_belanja')), 0)
      return <div className='font-semibold'>{formatRupiah(total)}</div>
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
