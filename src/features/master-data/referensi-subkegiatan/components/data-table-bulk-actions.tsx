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
import { SubKegiatansMultiDeleteDialog } from './ref-subkegiatan-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkExport = () => {
    const selectedSubKegiatan = selectedRows.map(
      (row) => row.original as Kegiatan
    )
    toast.promise(sleep(2000), {
      loading: 'Exporting Sub Kegiatan...',
      success: () => {
        table.resetRowSelection()
        return `Exported ${selectedSubKegiatan.length} Sub Kegiatan${selectedSubKegiatan.length > 1 ? 's' : ''} to CSV.`
      },
      error: 'Error',
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='Sub Kegiatan'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkExport()}
              className='size-8'
              aria-label='Export Sub Kegiatan'
              title='Export Sub Kegiatan'
            >
              <Download />
              <span className='sr-only'>Export Sub Kegiatan</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Export Sub Kegiatan</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Sub Kegiatan yg dipilih'
              title='Hapus Sub Kegiatan yg dipilih'
            >
              <Trash2 />
              <span className='sr-only'>Hapus Sub Kegiatan yg dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Sub Kegiatan yg dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <SubKegiatansMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  )
}
