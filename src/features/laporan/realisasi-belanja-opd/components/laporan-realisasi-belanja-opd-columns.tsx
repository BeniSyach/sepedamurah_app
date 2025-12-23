import { type ColumnDef } from '@tanstack/react-table'
import { type laporanBelanjaData } from '@/api'
import { formatRupiah } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'

// Mapping bulan → key sesuai schema dari backend
const bulanKeys = [
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
] as const

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isExcludedKode = (row: any) =>
  (row.kd_ref1 === '6' && row.kd_ref2 === '2' && row.kd_ref3 === '03') ||
  (row.kd_ref1 === '6' && row.kd_ref2 === '1' && row.kd_ref3 === '01')

export function ReferensiPengembalianColumns(
  bulanFilter: number
): ColumnDef<laporanBelanjaData>[] {
  return [
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
      footer: () => 'Total',
    },

    {
      accessorKey: 'jenis_belanja',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Jenis Belanja' />
      ),
      cell: ({ row }) => <div>{row.getValue('jenis_belanja')}</div>,
      enableSorting: true,
      footer: () => null, // Footer label
    },

    {
      accessorKey: 'total_pagu',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Pagu Belanja' />
      ),
      cell: ({ row }) => {
        const totalPagu = Number(row.original.total_pagu ?? 0)
        return <div>{formatRupiah(totalPagu)}</div>
      },
      enableSorting: true,
      footer: ({ table }) => {
        // Total semua row
        const total = table
          .getRowModel()
          .rows.reduce(
            (acc, row) => acc + Number(row.original.total_pagu ?? 0),
            0
          )

        // Total dari kode 6.2.03
        const totalKode6203 = table
          .getRowModel()
          .rows.filter(
            (row) =>
              row.original.kd_ref1 === '6' &&
              row.original.kd_ref2 === '2' &&
              row.original.kd_ref3 === '03'
          )
          .reduce((acc, row) => acc + Number(row.original.total_pagu ?? 0), 0)

        const totalKode6101 = table
          .getRowModel()
          .rows.filter(
            (row) =>
              row.original.kd_ref1 === '6' &&
              row.original.kd_ref2 === '1' &&
              row.original.kd_ref3 === '01'
          )
          .reduce((acc, row) => acc + Number(row.original.total_pagu ?? 0), 0)

        const adjustedTotal = total - totalKode6203 - totalKode6101

        return <div>{formatRupiah(adjustedTotal)}</div>
      },
    },

    {
      id: 'sd_bulan_lalu',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='s.d Bulan Lalu' />
      ),
      cell: ({ row }) => {
        const endIndex = bulanFilter - 2 // bulan lalu
        if (endIndex < 0) return <div>{formatRupiah(0)}</div>

        const total = bulanKeys
          .slice(0, endIndex + 1)
          .reduce((acc, key) => acc + Number(row.original[key] ?? 0), 0)

        return <div>{formatRupiah(total)}</div>
      },
      footer: ({ table }) => {
        const endIndex = bulanFilter - 2
        if (endIndex < 0) return <div>{formatRupiah(0)}</div>

        const total = table
          .getFilteredRowModel()
          .rows.reduce(
            (acc, row) =>
              acc +
              bulanKeys
                .slice(0, endIndex + 1)
                .reduce((sum, key) => sum + Number(row.original[key] ?? 0), 0),
            0
          )

        return <div className='font-semibold'>{formatRupiah(total)}</div>
      },
    },

    {
      id: 'bulan_ini',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Bulan Ini' />
      ),
      cell: ({ row }) => {
        const key = bulanKeys[bulanFilter - 1]
        const value = Number(row.original[key] ?? 0)
        return <div>{formatRupiah(value)}</div>
      },
      footer: ({ table }) => {
        const key = bulanKeys[bulanFilter - 1]
        const total = table
          .getFilteredRowModel()
          .rows.reduce((acc, row) => acc + Number(row.original[key] ?? 0), 0)
        return <div className='font-semibold'>{formatRupiah(total)}</div>
      },
    },

    {
      id: 'sd_bulan_ini',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='s.d Bulan Ini' />
      ),
      cell: ({ row }) => {
        const endIndex = bulanFilter - 1
        const total = bulanKeys
          .slice(0, endIndex + 1)
          .reduce((acc, key) => acc + Number(row.original[key] ?? 0), 0)

        return <div>{formatRupiah(total)}</div>
      },
      footer: ({ table }) => {
        const endIndex = bulanFilter - 1
        const total = table
          .getFilteredRowModel()
          .rows.reduce(
            (acc, row) =>
              acc +
              bulanKeys
                .slice(0, endIndex + 1)
                .reduce((sum, key) => sum + Number(row.original[key] ?? 0), 0),
            0
          )

        return <div className='font-semibold'>{formatRupiah(total)}</div>
      },
    },
    {
      id: 'sisa_pagu',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Sisa' />
      ),
      cell: ({ row }) => {
        // 🚫 kalau kode 6.2.03 / 6.1.01 → sisa = 0
        if (isExcludedKode(row.original)) {
          return <div>{formatRupiah(0)}</div>
        }

        const endIndex = bulanFilter - 1

        const realisasiSdBulan = bulanKeys
          .slice(0, endIndex + 1)
          .reduce((acc, key) => acc + Number(row.original[key] ?? 0), 0)

        const totalPagu = Number(row.original.total_pagu ?? 0)
        const sisa = totalPagu - realisasiSdBulan

        return <div>{formatRupiah(sisa)}</div>
      },
      footer: ({ table }) => {
        const endIndex = bulanFilter - 1

        const totalSisa = table
          .getFilteredRowModel()
          .rows// 🚫 exclude kode 6.2.03 & 6.1.01
          .filter((row) => !isExcludedKode(row.original))
          .reduce((acc, row) => {
            const realisasi = bulanKeys
              .slice(0, endIndex + 1)
              .reduce((sum, key) => sum + Number(row.original[key] ?? 0), 0)

            const pagu = Number(row.original.total_pagu ?? 0)

            return acc + (pagu - realisasi)
          }, 0)

        return <div className='font-semibold'>{formatRupiah(totalSisa)}</div>
      },
      enableSorting: true,
    },
    {
      accessorKey: 'persentase_pagu_belanja',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='%' />
      ),
      cell: ({ row }) => {
        const endIndex = bulanFilter - 1

        const realisasiSdBulan = bulanKeys
          .slice(0, endIndex + 1)
          .reduce((acc, key) => acc + Number(row.original[key] ?? 0), 0)

        const totalPagu = Number(row.original.total_pagu ?? 0)

        const persen = totalPagu > 0 ? (realisasiSdBulan / totalPagu) * 100 : 0

        return <div>{persen.toFixed(2)}%</div>
      },
      enableSorting: true,
    },
  ]
}
