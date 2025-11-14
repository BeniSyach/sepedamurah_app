/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { usePutTolakSp2dMulti } from '@/api/sp2d/tolak-berkas-masuk-multi'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

type UserMultiDeleteDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function TolakSp2dMultiDialog<TData>({
  open,
  onOpenChange,
  table,
}: UserMultiDeleteDialogProps<TData>) {
  const [value, setValue] = useState('')
  const { mutateAsync: tolakMulti } = usePutTolakSp2dMulti()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row: any) => row.original.id_sp2d)

  const handleDelete = () => {
    const formData = new FormData()
    formData.append('alasan_tolak', value)
    formData.append('supervisor_proses', 'Admin System')

    selectedIds.forEach((id) => formData.append('ids[]', id.toString()))

    tolakMulti(formData, {
      onSuccess: () => {
        toast.success(`Tolak ${selectedRows.length} Berkas Masuk SP2D`)
        table.resetRowSelection()
        onOpenChange(false)
      },
      onError: () => toast.error('Error'),
    })

    toast.loading('Menolak Berkas SP2D...')
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      title={
        <span className='text-destructive'>
          <AlertTriangle
            className='stroke-destructive me-1 inline-block'
            size={18}
          />{' '}
          Tolak {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'Berkas Masuk SP2D' : 'Berkas Masuk SP2D'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Apakah Anda yakin Menolak Berkas Masuk SP2D ini? <br />
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>Ketik Alasan Anda Menolak Berkas SP2D untuk konfirmasi:</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`Ketik Alasan Anda....`}
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
      confirmText='Tolak'
      destructive
    />
  )
}
