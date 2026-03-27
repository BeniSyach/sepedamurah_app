'use client'

import { useState } from 'react'
import { useDeleteRefPaguBelanja, type PaguBelanja } from '@/api'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

type RefPaguBelanjaDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: PaguBelanja
}

export function RefPaguBelanjasDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: RefPaguBelanjaDeleteDialogProps) {
  const [value, setValue] = useState('')

  const deleteMutation = useDeleteRefPaguBelanja()

  const handleDelete = () => {
    if (value.trim() !== currentRow.id_pb) return

    toast.promise(deleteMutation.mutateAsync(currentRow.id_pb), {
      loading: 'Menghapus Referensi Pagu Belanja...',
      success: () => {
        onOpenChange(false)
        return `Berhasil menghapus ID ${currentRow.id_pb}`
      },
      error: (err) => {
        return err?.message || 'Gagal menghapus data'
      },
    })
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== currentRow.id_pb}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete Referensi Pagu Belanja
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Apakah Anda Yakin menghapus Referensi Pagu belanja dengan id{' '}
            <span className='font-bold'>{currentRow.id_pb}</span>?
            <br />
          </p>

          <Label className='my-2'>
            Ketik Id Pagu Belanja:
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder='Ketik id Pagu Belanja.'
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>Peringatan!</AlertTitle>
            <AlertDescription>
              Harap berhati-hati, tindakan ini tidak dapat dikembalikan.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='Delete'
      destructive
    />
  )
}
