import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { type JenisBelanja } from '@/api'
import { Trash2, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { CeklisSPMsMultiDeleteDialog } from './ref-jenis-spm-multi-delete-dialog'

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
      (row) => row.original as JenisBelanja
    )
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} Ceklis Kelengkapan Dokumen...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} Ceklis Kelengkapan Dokumen${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} Ceklis Kelengkapan Dokumen`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='Ceklis Kelengkapan Dokumen'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Aktifkan Kelengkapan Dokumen yg Dipilih'
              title='Aktifkan Kelengkapan Dokumen yg Dipilih'
            >
              <Check />
              <span className='sr-only'>
                Aktifkan Kelengkapan Dokumen yg Dipilih
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Aktfikan Kelengkapan Dokumen</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Deactivate selected users'
              title='Deactivate selected users'
            >
              <X />
              <span className='sr-only'>Non Aktifkan Kelengkapan Dokumen</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Non Aktifkan Kelengkapan Dokumen</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Hapus Ceklis Kelengkapan Dokumen yg Dipilih'
              title='Hapus Ceklis Kelengkapan Dokumen yg Dipilih'
            >
              <Trash2 />
              <span className='sr-only'>
                Hapus Ceklis Kelengkapan Dokumen yg Dipilih
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus Ceklis Kelengkapan Dokumen yg Dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <CeklisSPMsMultiDeleteDialog
        table={table}
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
      />
    </>
  )
}
