'use client'

import { useSkpp } from './skpp-provider'
import { SkppActionDialog } from './skpp-action-dialog'
import { SkppPreviewDialog } from './skpp-preview-dialog'
import { SkppDeleteDialog } from './skpp-delete-dialog'
import { SkppPeriksaDialog } from './skpp-periksa-dialog'
import { SkppTolakDialog } from './skpp-tolak-dialog'
import { SkppTteAction } from './skpp-tte-action'

export function SkppDialogs() {
  const { open, setOpen } = useSkpp()

  return (
    <>
      <SkppActionDialog />
      <SkppPreviewDialog />
      <SkppDeleteDialog />

      <SkppPeriksaDialog
        open={open === 'periksa'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
      />

      <SkppTolakDialog
        open={open === 'tolak'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
      />

      <SkppTteAction
        open={open === 'tte'}
        onOpenChange={(isOpen) => !isOpen && setOpen(null)}
      />
    </>
  )
}
