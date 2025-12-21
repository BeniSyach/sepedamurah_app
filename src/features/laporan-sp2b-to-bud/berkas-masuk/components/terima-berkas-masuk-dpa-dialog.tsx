/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { type Table } from '@tanstack/react-table'
import { usePutTerimaDPAMulti } from '@/api'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ConfirmDialog } from '@/components/confirm-dialog'

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

type TerimaBerkasSP2DMultiDialogProps<TData> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table<TData>
}

export function TerimaFungsionalMultiDialog<TData>({
  open,
  onOpenChange,
  table,
}: TerimaBerkasSP2DMultiDialogProps<TData>) {
  const { mutateAsync: terimaMulti } = usePutTerimaDPAMulti()
  const selectedRows = table.getFilteredSelectedRowModel().rows
  const selectedIds = selectedRows.map((row: any) => row.original.id)
  const user = useAuthStore((s) => s.user)

  const handleTerima = () => {
    if (selectedIds.length === 0) return

    const formData = new FormData()
    formData.append('supervisor_proses', user?.id.toString() ?? '')
    selectedIds.forEach((id) => formData.append('ids[]', id.toString()))

    onOpenChange(false)

    toast.promise(
      terimaMulti(formData), // <= ini penting
      {
        loading: 'Mengirim data Laporan DPA...',
        success: () => {
          table.resetRowSelection()
          return `Berhasil menerima ${selectedRows.length} Laporan DPA.`
        },
        error: (err) => {
          return err?.response?.data?.message || 'Gagal memproses data'
        },
      }
    )
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleTerima}
      title={
        <span>
          <AlertTriangle className='me-1 inline-block' size={18} /> Terima{' '}
          {selectedRows.length}{' '}
          {selectedRows.length > 1 ? 'Berkas Masuk DPA' : 'Berkas Masuk DPA'}
        </span>
      }
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            Apakah Anda yakin Terima Berkas Masuk DPA ini? <br />
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <Alert variant='destructive'>
            <AlertTitle>Peringatan!</AlertTitle>
            <AlertDescription>
              Harap berhati-hati, tindakan ini tidak dapat dikembalikan.
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='terima'
    />
  )
}
