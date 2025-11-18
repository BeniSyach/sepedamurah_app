import { type ColumnDef } from '@tanstack/react-table'
import { type RekapSumberDanaItem } from '@/api'
import { formatRupiah } from '@/lib/utils'
import { DataTableRowActions } from './data-table-row-actions'

// Mapping bulan → key sesuai schema dari backend
const monthKeyMap: Record<number, keyof RekapSumberDanaItem> = {
  1: 'total_jan',
  2: 'total_feb',
  3: 'total_mar',
  4: 'total_apr',
  5: 'total_may',
  6: 'total_jun',
  7: 'total_jul',
  8: 'total_aug',
  9: 'total_sep',
  10: 'total_oct',
  11: 'total_nov',
  12: 'total_dec',
}

export function ReferensiRekapSumberDanaItemColumns(
  bulanFilter: number
): ColumnDef<RekapSumberDanaItem>[] {
  return [
    {
      id: 'no',
      header: () => <div>No</div>,
      cell: ({ row }) => <div>{row.index + 1}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'nm_sumber',
      header: 'Nama Sumber Dana',
      footer: () => <strong>Total</strong>,
    },

    // ------------ s.d Bulan Lalu ------------
    {
      id: 'sd_bulan_lalu',
      header: `s.d Bulan Lalu`,
      cell: ({ row }) => {
        const data = row.original
        let total = 0

        for (let i = 1; i < bulanFilter; i++) {
          const key = monthKeyMap[i]
          total += Number(data[key] ?? 0)
        }

        return <div>{formatRupiah(total)}</div>
      },
      footer: ({ table }) => {
        const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
          const item = row.original
          let subtotal = 0
          for (let i = 1; i < bulanFilter; i++) {
            const key = monthKeyMap[i]
            subtotal += Number(item[key] ?? 0)
          }
          return sum + subtotal
        }, 0)

        return <strong>{formatRupiah(total)}</strong>
      },
    },

    // ------------ Bulan Ini ------------
    {
      id: 'bulan_ini',
      header: `Bulan Ini`,
      cell: ({ row }) => {
        const data = row.original
        const key = monthKeyMap[bulanFilter]
        return <div>{formatRupiah(Number(data[key] ?? 0))}</div>
      },
      footer: ({ table }) => {
        const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
          const item = row.original
          const key = monthKeyMap[bulanFilter]
          return sum + Number(item[key] ?? 0)
        }, 0)

        return <strong>{formatRupiah(total)}</strong>
      },
    },

    // ------------ s.d Bulan Ini ------------
    {
      id: 'sd_bulan_ini',
      header: `s.d Bulan Ini`,
      cell: ({ row }) => {
        const data = row.original
        let total = 0

        for (let i = 1; i <= bulanFilter; i++) {
          const key = monthKeyMap[i]
          total += Number(data[key] ?? 0)
        }

        return <div>{formatRupiah(total)}</div>
      },
      footer: ({ table }) => {
        const total = table.getFilteredRowModel().rows.reduce((sum, row) => {
          const item = row.original
          let subtotal = 0
          for (let i = 1; i <= bulanFilter; i++) {
            const key = monthKeyMap[i]
            subtotal += Number(item[key] ?? 0)
          }
          return sum + subtotal
        }, 0)

        return <strong>{formatRupiah(total)}</strong>
      },
    },

    {
      id: 'actions',
      cell: DataTableRowActions,
      enableSorting: false,
      enableHiding: false,
    },
  ]
}
