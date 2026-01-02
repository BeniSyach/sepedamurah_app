/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useHapusSp2dMulti } from '@/api/sp2d/hapus-multi-sp2d'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

const CONFIRM_WORD = 'DELETE'

export function UsersMultiDeleteDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const { mutateAsync: hapusMulti } = useHapusSp2dMulti()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row: any) => row.original.id_sp2d)

  const handleDelete = () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`Tolong Ketik "${CONFIRM_WORD}" Untuk Konfirmasi.`)
      return
    }
    const formData = new FormData()

    selectedIds.forEach((id) => formData.append('ids[]', id.toString()))

    hapusMulti(formData, {
      onSuccess: () => {
        toast.success(`Berhasil Hapus ${selectedRows.length} Permohonan SP2D`)
        table.resetRowSelection()
        onOpenChange(false)
      },
      onError: () => toast.error('Error'),
    })

    toast.loading('Menghapus Permohonan SP2D...')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Delete {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'Permohonan SP2D' : 'Permohonan SP2D'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Apakah Anda yakin ingin menghapus data yang dipilih? <br />
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Ketik "{CONFIRM_WORD}" untuk konfirmasi:</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Ketik "${CONFIRM_WORD}"untuk Konfirmasi.`}
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
