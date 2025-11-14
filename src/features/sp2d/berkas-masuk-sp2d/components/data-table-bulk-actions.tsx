import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { TerimaSp2dMultiDialog } from './berkas-masuk-sp2d-multi-terima-dialog'
import { TolakSp2dMultiDialog } from './berkas-masuk-sp2d-multi-tolak-dialog'

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>
}

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showTolakConfirm, setShowTolakConfirm] = useState(false)
  const [showTerimaConfirm, setShowTerimaConfirm] = useState(false)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='Berkas Masuk SP2D'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size='icon'
              onClick={() => setShowTerimaConfirm(true)}
              className='size-8'
              aria-label='Hapus Berkas Masuk SP2D'
              title='Hapus Berkas Masuk SP2D'
            >
              <Check />
              <span className='sr-only'>Terima SP2D</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Terima SP2D</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowTolakConfirm(true)}
              className='size-8'
              aria-label='Hapus Berkas Masuk SP2D'
              title='Hapus Berkas Masuk SP2D'
            >
              <X />
              <span className='sr-only'>Tolak SP2D</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tolak SP2D</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <TolakSp2dMultiDialog
        table={table}
        open={showTolakConfirm}
        onOpenChange={setShowTolakConfirm}
      />

      <TerimaSp2dMultiDialog
        table={table}
        open={showTerimaConfirm}
        onOpenChange={setShowTerimaConfirm}
      />
    </>
  )
}
