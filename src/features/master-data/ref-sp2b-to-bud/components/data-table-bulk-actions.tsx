import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { type CeklisKelengkapanDokumen } from '@/api'
import { Trash2, X, Check } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { DPAsMultiDeleteDialog } from './ref-sp2b-to-bud-multi-delete-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map(
      (row) => row.original as CeklisKelengkapanDokumen
    )
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} Jenis SPM...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} Jenis SPM${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} Jenis SPM`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Aktifkan SPM yg Dipilih'
              title='Aktifkan SPM yg Dipilih'
            >
              <Check />
              <span className='sr-only'>Aktifkan SPM yg Dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Aktfikan SPM</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Non Aktifkan SPM'
              title='Non Aktifkan SPM'
            >
              <X />
              <span className='sr-only'>Non Aktifkan SPM</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Non Aktifkan SPM</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Jenis SPM yg Dipilih'
              title='Hapus Jenis SPM yg Dipilih'
            >
              <Trash2 />
              <span className='sr-only'>Hapus Jenis SPM yg Dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Jenis SPM yg Dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <DPAsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
