import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { type Program } from '@/api'
import { Trash2, Download } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { ProgramsMultiDeleteDialog } from './ref-program-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedTasks = selectedRows.map((row) => row.original as Program)
    toast.promise(sleep(2000), {
      loading: 'Exporting Program...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedTasks.length} Program${selectedTasks.length > 1 ? 's' : ''} to Excel.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='Program'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export Program'
              title='Export Program'
            >
              <Download />
              <span className='sr-only'>Export Program</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export Program</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Program yg dipilih'
              title='Hapus Program yg dipilih'
            >
              <Trash2 />
              <span className='sr-only'>Hapus Program yg dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Program yg dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <ProgramsMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
