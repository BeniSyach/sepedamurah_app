import { useDeleteBatasWaktu } from '@/api'
import { toast } from 'sonner'
import { useResetBatasWaktu } from '@/api/management-app/batas-waktu/use-reset-batas-waktu'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { BatasWaktusActionDialog } from './batas-waktu-action-dialog'
import { useRefBatasWaktu } from './batas-waktu-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefBatasWaktu()

  const { mutateAsync } = useDeleteBatasWaktu()
  const { mutateAsync: resetWaktu } = useResetBatasWaktu()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.hari}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  const handleReset = async () => {
    const resetPromise = resetWaktu()

    await toast.promise(resetPromise, {
      loading: 'Reset data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Batas Waktu SKPD berhasil direset.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <BatasWaktusActionDialog
        key='batas-waktu-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <ConfirmDialog
        key={`batas-waktu-reset`}
        destructive
        open={open === 'reset'}
        onOpenChange={() => {
          setOpen('reset')
        }}
        handleConfirm={handleReset}
        className='max-w-md'
        title={`reset batas Waktu ?`}
        desc={<>Kamu akan Reset batas Waktu SKPD</>}
        confirmText='Reset'
      />

      {currentRow && (
        <>
          <BatasWaktusActionDialog
            key={`batas-waktu-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key={`batas-waktu-delete-${currentRow.id}`}
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleDelete}
            className='max-w-md'
            title={`Hapus data Ini: ${currentRow.hari} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.hari}</strong>. <br />
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
