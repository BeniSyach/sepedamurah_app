import { type ColumnDef } from '@tanstack/react-table'
import { type AksesAssetBendaharaGroup } from '@/api'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiAksesAssetBendaharaGroupColumns: ColumnDef<AksesAssetBendaharaGroup>[] =
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
      id: 'Asset_list',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title='Daftar BMD (Barang Milik Daerah)'
        />
      ),
      cell: ({ row }) => {
        const Asset = row.original.asset ?? []

        return (
          <ul className='list-disc space-y-1 ps-5'>
            {Asset.length > 0 ? (
              Asset.map((item) => (
                <li key={item.id} className='text-sm'>
                  {item.nm_asset_bendahara}
                </li>
              ))
            ) : (
              <li className='text-muted-foreground italic'>
                Tidak ada BMD (Barang Milik Daerah)
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
