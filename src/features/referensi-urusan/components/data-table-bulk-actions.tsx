import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { type Urusan } from '@/api'
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
import { UrusanMultiDeleteDialog } from './ref-urusan-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedUrusan = selectedRows.map((row) => row.original as Urusan)
    toast.promise(sleep(2000), {
      loading: 'Exporting Urusan...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedUrusan.length} Urusan${selectedUrusan.length > 1 ? 's' : ''} to Excel.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='Urusan'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export Urusan'
              title='Export Urusan'
            >
              <Download />
              <span className='sr-only'>Export Urusan</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export Urusan</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Urusan yg dipilih'
              title='Hapus Urusan yg dipilih'
            >
              <Trash2 />
              <span className='sr-only'>Hapus Urusan yg dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Urusan yg dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <UrusanMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
