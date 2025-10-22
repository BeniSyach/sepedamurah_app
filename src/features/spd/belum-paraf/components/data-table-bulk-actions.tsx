import { type Table } from '@tanstack/react-table'
import { type PermohonanSpd } from '@/api'
import { UserX, UserCheck } from 'lucide-react'
import { toast } from 'sonner'
import { sleep } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const selectedRows = table.getFilteredSelectedRowModel().rows

  const handleBulkStatusChange = (status: 'active' | 'inactive') => {
    const selectedUsers = selectedRows.map(
      (row) => row.original as PermohonanSpd
    )
    toast.promise(sleep(2000), {
      loading: `${status === 'active' ? 'Activating' : 'Deactivating'} users...`,
      success: () => {
        table.resetRowSelection()
        return `${status === 'active' ? 'Activated' : 'Deactivated'} ${selectedUsers.length} user${selectedUsers.length > 1 ? 's' : ''}`
      },
      error: `Error ${status === 'active' ? 'activating' : 'deactivating'} users`,
    })
    table.resetRowSelection()
  }

  return (
    <>
      <BulkActionsToolbar table={table} entityName='SPD Belum Paraf'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('active')}
              className='size-8'
              aria-label='Paraf SPD yg Sudah Dipilih'
              title='Paraf SPD yg Sudah Dipilih'
            >
              <UserCheck />
              <span className='sr-only'>Paraf SPD yg Sudah Dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Paraf SPD yg Sudah Dipilih</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => handleBulkStatusChange('inactive')}
              className='size-8'
              aria-label='Tolak SPD Yang Dipilih'
              title='Tolak SPD Yang Dipilih'
            >
              <UserX />
              <span className='sr-only'>Tolak SPD Yang Dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tolak SPD Yang Dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
    </>
  )
}
