import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { type Rekening } from '@/api'
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
import { RefRekeningsMultiDeleteDialog } from './ref-rekening-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedSubRekening = selectedRows.map(
      (row) => row.original as Rekening
    )
    toast.promise(sleep(2000), {
      loading: 'Exporting Rekening...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedSubRekening.length} Rekening${selectedSubRekening.length > 1 ? 's' : ''} to CSV.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='rekening'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export Rekening'
              title='Export Rekening'
            >
              <Download />
              <span className='sr-only'>Export Rekening</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export Rekening</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Rekening yg dipilih'
              title='Hapus Rekening yg dipilih'
            >
              <Trash2 />
              <span className='sr-only'>Hapus Rekening yg dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Rekening yg dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <RefRekeningsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
