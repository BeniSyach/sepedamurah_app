import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { UsersMultiDeleteDialog } from './laporan-pajak-bendahara-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar
        table={table}
        entityName='Laporan Rekonsiliasi Gaji SKPD'
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Laporan Rekonsiliasi Gaji SKPD yg dipilih'
              title='Hapus Laporan Rekonsiliasi Gaji SKPD yg dipilih'
            >
              <Trash2 />
              <span className='sr-only'>
                Hapus Laporan Rekonsiliasi Gaji SKPD yg dipilih
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Laporan Rekonsiliasi Gaji SKPD yg dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UsersMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
