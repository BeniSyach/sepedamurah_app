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
import { PermohonanPenerbitanPeriksaDialog } from './permohonan-penerbitan-periksa-dialog'
import { PermohonanPenerbitanSP2DActionDialog } from './permohonan-penerbitan-sp2d-action-dialog'
import { useRefSp2dItem } from './permohonan-penerbitan-sp2d-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSp2dItem()
  const { mutateAsync } = useDeletePermohonanSP2D()
  const levelAkses = localStorage.getItem('user_role')
  const [showClosedDialog, setShowClosedDialog] = useState(false)

  const isAfterClosingTime = () => {
    const now = new Date()
    return now.getHours() >= 24
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
      <PermohonanPenerbitanSP2DActionDialog
        key='permohonan-penerbitan-sp2d-add'
        open={open === 'add'}
        edit='add'
        onOpenChange={(val) => setOpen(val ? 'add' : null)}
      />

      {/* === EDIT & DELETE === */}
      {currentRow && (
        <>
          {levelAkses !== 'Bendahara' && (
            <PermohonanPenerbitanPeriksaDialog
              key={`permohonan-penerbitan-sp2d-periksa-${currentRow.id_sp2d}`}
              open={open === 'periksa'}
              onOpenChange={(val) => setOpen(val ? 'periksa' : null)}
              currentRow={currentRow}
            />
          )}

          {/* Hide EDIT if proses === 1 */}
          {currentRow.proses !== '1' && (
            <PermohonanPenerbitanSP2DActionDialog
              key={`permohonan-penerbitan-sp2d-edit-${currentRow.id_sp2d}`}
              open={open === 'edit'}
              edit='edit'
              onOpenChange={(val) => setOpen(val ? 'edit' : null)}
              currentRow={currentRow}
            />
          )}

          {/* Hide DELETE if proses === 1 */}
          {/* {currentRow.proses !== '1' && ( */}
          <ConfirmDialog
            key={`permohonan-penerbitan-sp2d-delete-${currentRow.id_sp2d}`}
            destructive
            open={open === 'delete'}
            onOpenChange={(val) => setOpen(val ? 'delete' : null)}
            handleConfirm={handleDelete}
            className='max-w-md'
            title={`Hapus SP2D ini: ${currentRow.nama_file} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nama_file}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Delete'
          />
          {/* )} */}
        </>
      )}
    </>
  )
}
