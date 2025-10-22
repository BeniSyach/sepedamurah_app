import { useDeleteRefRekening } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { RekeningsActionDialog } from './ref-rekening-action-dialog'
import { RekeningsImportDialog } from './ref-rekening-import-dialog'
import { useRefRekening } from './ref-rekening-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefRekening()

  const { mutateAsync } = useDeleteRefRekening()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_rekening1: currentRow.kd_rekening1,
      kd_rekening2: currentRow.kd_rekening2,
      kd_rekening3: currentRow.kd_rekening3,
      kd_rekening4: currentRow.kd_rekening4,
      kd_rekening5: currentRow.kd_rekening5,
      kd_rekening6: currentRow.kd_rekening6,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_rekening}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <RekeningsActionDialog
        key='ref-rekening-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <RekeningsImportDialog
        key='ref-rekening-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <RekeningsActionDialog
            key={`ref-rekening-edit-${currentRow.kd_rekening1}-${currentRow.kd_rekening2}-${currentRow.kd_rekening3}-${currentRow.kd_rekening4}-${currentRow.kd_rekening5}`}
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
            key={`ref-rekening-delete-${currentRow.kd_rekening1}-${currentRow.kd_rekening2}-${currentRow.kd_rekening3}-${currentRow.kd_rekening4}-${currentRow.kd_rekening5}`}
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
            title={`Hapus Sub Kegiatan Ini: ${currentRow.nm_rekening} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_rekening}</strong>. <br />
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
