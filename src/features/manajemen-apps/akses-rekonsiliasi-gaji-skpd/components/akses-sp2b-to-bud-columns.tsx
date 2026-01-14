import { type ColumnDef } from '@tanstack/react-table'
import { type AksesRefRekonsiliasiGajiSkpdGroup } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiAksesRefRekonsiliasiGajiSkpdGroupColumns: ColumnDef<AksesRefRekonsiliasiGajiSkpdGroup>[] =
  [
    // ==================== No ====================
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

    // ==================== SKPD ====================
    {
      accessorKey: 'nama_opd',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='SKPD' />
      ),
      cell: ({ row }) => {
        const skpd = row.original.nama_opd
        return <div>{skpd ?? '-'}</div>
      },
      enableSorting: true,
    },

    // ==================== DPA LIST ====================
    {
      id: 'sp2b_list',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Daftar SPB (Surat Pengesahan Belanja)'
        />
      ),
      cell: ({ row }) => {
        const sp2b = row.original.rekonsiliasi ?? []

        return (
          <ul className='list-disc space-y-1 ps-5'>
            {sp2b.length > 0 ? (
              sp2b.map((item) => (
                <li key={item.id} className='text-sm'>
                  {item.nm_rekonsiliasi_gaji_skpd}
                </li>
              ))
            ) : (
              <li className='text-muted-foreground italic'>
                Tidak ada SPB (Surat Pengesahan Belanja)
              </li>
            )}
          </ul>
        )
      },
    },

    // ==================== Actions ====================
    {
      id: 'actions',
      cell: DataTableRowActions,
      enableSorting: false,
      enableHiding: false,
    },
  ]
