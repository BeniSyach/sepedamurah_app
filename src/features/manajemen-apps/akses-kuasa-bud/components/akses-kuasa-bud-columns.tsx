/* eslint-disable @typescript-eslint/no-explicit-any */
import { type ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from '@/components/data-table'
import AksesKuasaBUDCellActions from './akses-kuasa-bud-cell-actions'

export const ReferensiAksesKuasaBudColumns: ColumnDef<any>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Kuasa BUD' />
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
              <AksesKuasaBUDCellActions
                row={{
                  ...row,
                  original: {
                    ...originalData, // semua data operator
                    id: opd.id,
                    id_kbud: opd.id_kbud, // SKPD spesifik (berisi seluruh field)
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
