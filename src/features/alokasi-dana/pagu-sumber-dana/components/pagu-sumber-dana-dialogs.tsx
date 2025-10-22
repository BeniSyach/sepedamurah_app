import { useDeletePaguSumberDana } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UsersActionDialog } from './pagu-sumber-dana-action-dialog'
import { useRefPaguSumberDana } from './pagu-sumber-dana-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPaguSumberDana()
  const { mutateAsync } = useDeletePaguSumberDana()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_ref1: currentRow.kd_ref1,
      kd_ref2: currentRow.kd_ref2,
      kd_ref3: currentRow.kd_ref3,
      kd_ref4: currentRow.kd_ref4,
      kd_ref5: currentRow.kd_ref5,
      kd_ref6: currentRow.kd_ref6,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.pagu}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }
  return (
    <>
      <UsersActionDialog
        key='pagu-sumber-dana-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`pagu-sumber-dana-edit-${currentRow.kd_ref1}-${currentRow.kd_ref2}-${currentRow.kd_ref3}-${currentRow.kd_ref4}-${currentRow.kd_ref5}-${currentRow.kd_ref6}`}
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
            key={`pagu-sumber-dana-delete-${currentRow.kd_ref1}-${currentRow.kd_ref2}-${currentRow.kd_ref3}-${currentRow.kd_ref4}-${currentRow.kd_ref5}-${currentRow.kd_ref6}`}
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
            title={`Hapus Pagu Sumber Dana Ini: ${currentRow.pagu} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.pagu}</strong>. <br />
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
