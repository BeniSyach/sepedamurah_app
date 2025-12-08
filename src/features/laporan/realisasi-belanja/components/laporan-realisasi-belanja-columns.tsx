import { type ColumnDef } from '@tanstack/react-table'
import { type laporanBelanjaData } from '@/api'
import { formatRupiah } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'

const bulanKeys: (keyof laporanBelanjaData)[] = [
  'belanja_jan',
  'belanja_feb',
  'belanja_mar',
  'belanja_apr',
  'belanja_may',
  'belanja_jun',
  'belanja_jul',
  'belanja_aug',
  'belanja_sep',
  'belanja_oct',
  'belanja_nov',
  'belanja_dec',
]

export const ReferensiPengembalianColumns: ColumnDef<laporanBelanjaData>[] = [
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

  {
    id: 'kode_referensi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Referensi' />
    ),
    cell: ({ row }) => {
      const kd_ref1 = row.original.kd_ref1
      const kd_ref2 = row.original.kd_ref2
      const kd_ref3 = row.original.kd_ref3
      return <div>{`${kd_ref1}.${kd_ref2}.${kd_ref3}`}</div>
    },
    enableSorting: false,
    footer: () => null,
  },

  {
    accessorKey: 'jenis_belanja',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis Belanja' />
    ),
    cell: ({ row }) => <div>{row.getValue('jenis_belanja')}</div>,
    enableSorting: true,
    footer: () => 'Total', // Footer label
  },

  // ✅ s.d Bulan Lalu
  {
    accessorKey: 'pagu',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='s.d Bulan Lalu' />
    ),
    cell: ({ row }) => {
      // hitung total s.d bulan lalu (misal bulan ini = juli)
      const bulanLaluIndex = new Date().getMonth() - 1 // Januari = 0
      const sum = bulanKeys
        .slice(0, bulanLaluIndex + 1)
        .reduce((acc, key) => acc + Number(row.original[key] ?? 0), 0)
      return <div>{formatRupiah(sum)}</div>
    },
    footer: (props) => {
      const bulanLaluIndex = new Date().getMonth() - 1
      const total = props.table
        .getFilteredRowModel()
        .rows.reduce(
          (acc, row) =>
            acc +
            bulanKeys
              .slice(0, bulanLaluIndex + 1)
              .reduce((sum, key) => sum + Number(row.original[key] ?? 0), 0),
          0
        )
      return <div className='font-semibold'>{formatRupiah(total)}</div>
    },
    enableSorting: true,
  },

  // ✅ Bulan Ini
  {
    accessorKey: 'bulan_ini',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bulan Ini' />
    ),
    cell: ({ row }) => {
      const bulanIniIndex = new Date().getMonth()
      const value = row.original[bulanKeys[bulanIniIndex]] ?? 0
      return <div>{formatRupiah(value)}</div>
    },
    footer: (props) => {
      const bulanIniIndex = new Date().getMonth()
      const total = props.table
        .getFilteredRowModel()
        .rows.reduce(
          (acc, row) =>
            acc + Number(row.original[bulanKeys[bulanIniIndex]] ?? 0),
          0
        )
      return <div className='font-semibold'>{formatRupiah(total)}</div>
    },
    enableSorting: true,
  },

  // ✅ s.d Bulan Ini
  {
    accessorKey: 'sd_bulan_ini',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='s.d Bulan Ini' />
    ),
    cell: ({ row }) => {
      const bulanIniIndex = new Date().getMonth()
      const sum = bulanKeys
        .slice(0, bulanIniIndex + 1)
        .reduce((acc, key) => acc + Number(row.original[key] ?? 0), 0)
      return <div>{formatRupiah(sum)}</div>
    },
    footer: (props) => {
      const bulanIniIndex = new Date().getMonth()
      const total = props.table
        .getFilteredRowModel()
        .rows.reduce(
          (acc, row) =>
            acc +
            bulanKeys
              .slice(0, bulanIniIndex + 1)
              .reduce((sum, key) => sum + Number(row.original[key] ?? 0), 0),
          0
        )
      return <div className='font-semibold'>{formatRupiah(total)}</div>
    },
    enableSorting: true,
  },

  {
    accessorKey: 'persentase_pagu_belanja',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Persentase Pagu Belanja' />
    ),
    cell: ({ row }) => {
      const totalRealisasi = Number(row.original.total_realisasi ?? 0)
      const totalPagu = Number(row.original.total_pagu ?? 0)

      // hitung persen
      const persen = totalPagu > 0 ? (totalRealisasi / totalPagu) * 100 : 0

      return <div>{persen.toFixed(2)}%</div>
    },
    enableSorting: true,
  },
]
