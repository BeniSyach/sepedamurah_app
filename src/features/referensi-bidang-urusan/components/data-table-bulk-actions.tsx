import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { type BidangUrusan } from '@/api'
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
import { BidangUrusanMultiDeleteDialog } from './ref-bidang-urusan-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedTasks = selectedRows.map(
      (row) => row.original as BidangUrusan
    )
    toast.promise(sleep(2000), {
      loading: 'Exporting Bidang Urusan...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedTasks.length} Bidang Urusan${selectedTasks.length > 1 ? 's' : ''} to Excel.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='Bidang Urusan'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export Bidang Urusan'
              title='Export Bidang Urusan'
            >
              <Download />
              <span className='sr-only'>Export Bidang Urusan</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export Bidang Urusan</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Bidang Urusan yg Dipilih'
              title='Hapus Bidang Urusan yg Dipilih'
            >
              <Trash2 />
              <span className='sr-only'>Hapus Bidang Urusan yg Dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Bidang Urusan yg Dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <BidangUrusanMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
