import { useDeleteRefJenisBelanja } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { JenisBelanjasActionDialog } from './ref-jenis-belanja-action-dialog'
import { JenisBelanjasImportDialog } from './ref-jenis-belanja-import-dialog'
import { useRefJenisBelanja } from './ref-jenis-belanja-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefJenisBelanja()

  const { mutateAsync } = useDeleteRefJenisBelanja()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_ref1: currentRow.kd_ref1,
      kd_ref2: currentRow.kd_ref2,
      kd_ref3: currentRow.kd_ref3,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_belanja}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <JenisBelanjasActionDialog
        key='ref-jenis-belanja-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <JenisBelanjasImportDialog
        key='ref-jenis-belanja-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <JenisBelanjasActionDialog
            key={`ref-jenis-belanja-edit-${currentRow.kd_ref1}.${currentRow.kd_ref2}.${currentRow.kd_ref3}`}
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
            key={`ref-jenis-belanja-delete-${currentRow.kd_ref1}.${currentRow.kd_ref2}.${currentRow.kd_ref3}`}
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
            title={`Hapus Ceklis Kelengkapan Ini: ${currentRow.nm_belanja} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_belanja}</strong>. <br />
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
