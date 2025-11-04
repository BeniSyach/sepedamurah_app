import { type ColumnDef } from '@tanstack/react-table'
import { type LaporanRealisasiSumberDana } from '@/api'
import { formatRupiah } from '@/lib/utils'
import { DataTableColumnHeader } from '@/components/data-table'

export const ReferensiPengembalianColumns: ColumnDef<LaporanRealisasiSumberDana>[] =
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
      footer: () => null,
    },

    // ✅ Kode Referensi
    {
      id: 'kode_referensi',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Kode Rekening' />
      ),
      cell: ({ row }) => {
        // Ambil dua field dari data baris
        const kd_ref1 = row.original.kd_ref1
        const kd_ref2 = row.original.kd_ref2
        const kd_ref3 = row.original.kd_ref3
        const kd_ref4 = row.original.kd_ref4
        const kd_ref5 = row.original.kd_ref5
        const kd_ref6 = row.original.kd_ref6

        // Gabungkan dengan format, misal 1-02 (kd_ref2 di-padding 2 digit)
        const formatted = `${kd_ref1}.${kd_ref2}.${kd_ref3}.${kd_ref4}.${kd_ref5}.${kd_ref6}`

        return <div>{formatted}</div>
      },
      enableSorting: false,

      footer: () => 'TOTAL',
    },

    // ✅ nama Sumber Dana
    {
      accessorKey: 'nm_sumber',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Uraian' />
      ),
      cell: ({ row }) => <div>{row.getValue('nm_sumber')}</div>,
      enableSorting: true,
      footer: () => null,
    },

    // ✅ pagu
    {
      accessorKey: 'pagu',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Pagu Anggaran' />
      ),
      cell: ({ row }) => <div>{formatRupiah(row.getValue('pagu'))}</div>,
      footer: (props) => {
        const total = props.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + Number(row.getValue('pagu')), 0)
        return <div className='font-semibold'>{formatRupiah(total)}</div>
      },
      enableSorting: true,
    },

    // ✅ jumlah_silpa
    {
      accessorKey: 'jumlah_silpa',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Saldo Awal Tahun Lalu' />
      ),
      cell: ({ row }) => (
        <div>{formatRupiah(row.getValue('jumlah_silpa'))}</div>
      ),
      footer: (props) => {
        const total = props.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) => sum + Number(row.getValue('jumlah_silpa')),
            0
          )
        return <div className='font-semibold'>{formatRupiah(total)}</div>
      },
      enableSorting: true,
    },

    // ✅ Dana Masuk
    {
      accessorKey: 'sumber_dana',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Dana Masuk' />
      ),
      cell: ({ row }) => <div>{formatRupiah(row.getValue('sumber_dana'))}</div>,
      footer: (props) => {
        const total = props.table
          .getFilteredRowModel()
          .rows.reduce(
            (sum, row) => sum + Number(row.getValue('sumber_dana')),
            0
          )
        return <div className='font-semibold'>{formatRupiah(total)}</div>
      },
      enableSorting: true,
    },

    // ✅ Realisasi Belanja SKPD
    {
      accessorKey: 'belanja',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Realisasi Belanja SKPD' />
      ),
      cell: ({ row }) => <div>{formatRupiah(row.getValue('belanja'))}</div>,
      footer: (props) => {
        const total = props.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + Number(row.getValue('belanja')), 0)
        return <div className='font-semibold'>{formatRupiah(total)}</div>
      },
      enableSorting: true,
    },

    // ✅ Sisa Sumber Dana
    {
      accessorKey: 'sisa',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Sisa Sumber Dana' />
      ),
      cell: ({ row }) => <div>{formatRupiah(row.getValue('sisa'))}</div>,
      footer: (props) => {
        const total = props.table
          .getFilteredRowModel()
          .rows.reduce((sum, row) => sum + Number(row.getValue('sisa')), 0)
        return <div className='font-semibold'>{formatRupiah(total)}</div>
      },
      enableSorting: true,
    },
  ]
