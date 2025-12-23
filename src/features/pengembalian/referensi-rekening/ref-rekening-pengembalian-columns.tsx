import { type ColumnDef } from '@tanstack/react-table'
import { type DatRekeningItem } from '@/api'
import { cn } from '@/lib/utils'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { DataTableRowActions } from './data-table-row-actions'

export const ReferensiDatRekeningItemColumns: ColumnDef<DatRekeningItem>[] = [
  // ✅ Checkbox
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
    meta: {
      className: cn('sticky left-0 z-10 bg-background'),
    },
  },

  // ✅ Tahun Rekening
  {
    accessorKey: 'tahun_rek',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun' />
    ),
    cell: ({ row }) => <div>{row.getValue('tahun_rek')}</div>,
    enableSorting: true,
    meta: { className: 'min-w-[100px]' },
  },

  // ✅ Kode Rekening (digabung)
  {
    id: 'kode_rekening',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Rekening' />
    ),
    cell: ({ row }) => {
      const r = row.original
      const kode = [
        r.kd_rek1,
        r.kd_rek2,
        r.kd_rek3,
        r.kd_rek4,
        r.kd_rek5,
        r.kd_rek6,
      ]
        .filter(Boolean)
        .join('.')

      return <div className='font-mono'>{kode}</div>
    },
    enableSorting: false,
    meta: { className: 'min-w-[180px]' },
  },

  // ✅ Nama Rekening
  {
    accessorKey: 'nm_rekening',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Rekening' />
    ),
    cell: ({ row }) => <div>{row.getValue('nm_rekening')}</div>,
    enableSorting: true,
    meta: { className: 'min-w-[240px]' },
  },

  // ✅ Status
  {
    accessorKey: 'status_rek',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>('status_rek')
      return (
        <span
          className={
            status === '1'
              ? 'font-medium text-green-600'
              : 'font-medium text-red-600'
          }
        >
          {status === '1' ? 'Aktif' : 'Non Aktif'}
        </span>
      )
    },
    enableSorting: true,
    meta: { className: 'min-w-[120px]' },
  },

  // ✅ Aksi
  {
    id: 'actions',
    cell: DataTableRowActions,
    enableSorting: false,
    enableHiding: false,
  },
]
