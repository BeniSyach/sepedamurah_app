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
import { TerimaFungsionalMultiDialog } from './terima-berkas-masuk-dpa-dialog'
import { TolakFungsionalMultiDialog } from './tolak-berkas-masuk-dpa-dialog'

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
      <BulkActionsToolbar table={table} entityName='user'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size='icon'
              onClick={() => setShowTerimaConfirm(true)}
              className='size-8'
              aria-label='Terima Berkas Masuk Laporan Pajak Bendahara'
              title='Terima Berkas Masuk Laporan Pajak Bendahara'
            >
              <Check />
              <span className='sr-only'>
                Terima Berkas Masuk Laporan Pajak Bendahara
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Terima Berkas Masuk Laporan Pajak Bendahara</p>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowTolakConfirm(true)}
              className='size-8'
              aria-label='Tolak Berkas Masuk Laporan Pajak Bendahara'
              title='Tolak Berkas Masuk Laporan Pajak Bendahara'
            >
              <X />
              <span className='sr-only'>
                Tolak Berkas Masuk Laporan Pajak Bendahara
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Tolak Berkas Masuk Laporan Pajak Bendahara</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>
      <TolakFungsionalMultiDialog
        table={table}
        open={showTolakConfirm}
        onOpenChange={setShowTolakConfirm}
      />

      <TerimaFungsionalMultiDialog
        table={table}
        open={showTerimaConfirm}
        onOpenChange={setShowTerimaConfirm}
      />
    </>
  )
}
