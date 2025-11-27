/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import AksesOperatorCellActions from './AksesOperatorCellActions'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ReferensiAksesOperatorColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Operator' />
    ),
    cell: ({ row }) => (
      <div className='font-semibold capitalize'>{row.original.name}</div>
    ),
  },

  {
    accessorKey: 'skpds',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SKPD yang Diampu' />
    ),
    cell: ({ row }) => {
      const originalData = row.original
      return (
        <div className='flex flex-col gap-2'>
          {originalData.akses.map((opd: any, idx: number) => (
            <div
              key={idx}
              className='flex items-center justify-between rounded border p-2'
            >
              {/* Nama SKPD */}
              <div className='text-sm'>• {opd.skpd.nm_opd}</div>

              {/* Kirim semua data + SKPD spesifik */}
              <AksesOperatorCellActions
                row={{
                  ...row,
                  original: {
                    ...originalData, // semua data operator
                    id: opd.id,
                    id_operator: opd.id_operator, // SKPD spesifik (berisi seluruh field)
                    kd_opd1: opd.skpd.kd_opd1, // kode lengkap
                    kd_opd2: opd.skpd.kd_opd2,
                    kd_opd3: opd.skpd.kd_opd3,
                    kd_opd4: opd.skpd.kd_opd4,
                    kd_opd5: opd.skpd.kd_opd5,
                  },
                }}
              />
            </div>
          ))}
        </div>
      )
    },
  },
]
