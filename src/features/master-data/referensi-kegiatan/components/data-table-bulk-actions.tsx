import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { type Kegiatan } from '@/api'
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
import { KegiatansMultiDeleteDialog } from './ref-kegiatan-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedKegiatan = selectedRows.map((row) => row.original as Kegiatan)
    toast.promise(sleep(2000), {
      loading: 'Exporting Kegiatan...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedKegiatan.length} Kegiatan${selectedKegiatan.length > 1 ? 's' : ''} to CSV.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='Kegiatan'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export Kegiatan'
              title='Export Kegiatan'
            >
              <Download />
              <span className='sr-only'>Export Kegiatan</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export Kegiatan</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Kegiatan yg dipilih'
              title='Hapus Kegiatan yg dipilih'
            >
              <Trash2 />
              <span className='sr-only'>Hapus Kegiatan yg dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Kegiatan yg dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <KegiatansMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
