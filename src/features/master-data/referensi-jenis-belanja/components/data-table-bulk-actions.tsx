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
import { JenisBelanjasMultiDeleteDialog } from './ref-jenis-belanja-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='Jenis Belanja'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Jenis Belanja yg Dipilih'
              title='Hapus Jenis Belanja yg Dipilih'
            >
              <Trash2 />
              <span className='sr-only'>Hapus Jenis Belanja yg Dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Jenis Belanja yg Dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <JenisBelanjasMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
