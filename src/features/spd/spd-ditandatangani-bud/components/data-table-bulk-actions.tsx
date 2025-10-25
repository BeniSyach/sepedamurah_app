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
import { UsersMultiDeleteDialog } from './spd-ditandatangani-bud-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='SPD Ditandatangani BUD'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus SPD Ditandatangani BUD Yg Dipilih'
              title='Hapus SPD Ditandatangani BUD Yg Dipilih'
            >
              <Trash2 />
              <span className='sr-only'>
                Hapus SPD Ditandatangani BUD Yg Dipilih
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus SPD Ditandatangani BUD Yg Dipilih</p>
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
