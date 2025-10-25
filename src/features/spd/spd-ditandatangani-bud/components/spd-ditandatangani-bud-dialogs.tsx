import { useDeletePermohonanSPD } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UsersActionDialog } from './spd-ditandatangani-bud-action-dialog'
import { useRefPermohonanSpd } from './spd-ditandatangani-bud-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()
  const { mutateAsync } = useDeletePermohonanSPD()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <UsersActionDialog
        key='spd-ditandatangani-bud-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`spd-ditandatangani-bud-edit-${currentRow.id}`}
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
            key={`spd-ditandatangani-bud-delete-${currentRow.id}`}
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
            title={`Hapus SPD Ditandatangani BUD Ini: ${currentRow.nama_file_lampiran} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nama_file_lampiran}</strong>. <br />
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
