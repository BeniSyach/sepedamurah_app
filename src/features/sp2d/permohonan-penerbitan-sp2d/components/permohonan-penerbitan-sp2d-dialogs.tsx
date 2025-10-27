import { useState, useEffect } from 'react'
import { useDeletePermohonanSP2D } from '@/api'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UsersActionDialog } from './permohonan-penerbitan-sp2d-action-dialog'
import { useRefSp2dItem } from './permohonan-penerbitan-sp2d-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSp2dItem()
  const { mutateAsync } = useDeletePermohonanSP2D()

  const [showClosedDialog, setShowClosedDialog] = useState(false)

  const isAfterClosingTime = () => {
    const now = new Date()
    return now.getHours() >= 16
  }

  // 🧠 Deteksi ketika user membuka form add/edit
  useEffect(() => {
    if ((open === 'add' || open === 'edit') && isAfterClosingTime()) {
      setShowClosedDialog(true)
      setOpen(null) // jangan tampilkan form
    }
  }, [open, setOpen])

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id_sp2d })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)
        return `Data berhasil dihapus.`
      },
      error: (err) => err.data?.message ?? 'Gagal menghapus data.',
    })
  }

  return (
    <>
      {/* === Dialog Pelayanan Ditutup === */}
      <AlertDialog open={showClosedDialog} onOpenChange={setShowClosedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pelayanan Ditutup</AlertDialogTitle>
            <AlertDialogDescription>
              Maaf, pelayanan sudah ditutup untuk hari ini.
              <br />
              Silakan kembali besok sebelum pukul <strong>16:00</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowClosedDialog(false)}>
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* === ADD === */}
      <UsersActionDialog
        key='permohonan-penerbitan-sp2d-add'
        open={open === 'add'}
        onOpenChange={(val) => setOpen(val ? 'add' : null)}
      />

      {/* === EDIT & DELETE === */}
      {currentRow && (
        <>
          <UsersActionDialog
            key={`permohonan-penerbitan-sp2d-edit-${currentRow.id_sp2d}`}
            open={open === 'edit'}
            onOpenChange={(val) => setOpen(val ? 'edit' : null)}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key={`permohonan-penerbitan-sp2d-delete-${currentRow.id_sp2d}`}
            destructive
            open={open === 'delete'}
            onOpenChange={(val) => setOpen(val ? 'delete' : null)}
            handleConfirm={handleDelete}
            className='max-w-md'
            title={`Hapus Akses Kuasa BUD Ini: ${currentRow.jenis_berkas} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.jenis_berkas}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
