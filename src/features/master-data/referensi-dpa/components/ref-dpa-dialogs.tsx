import { useDeleteRefDPA } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { DPAsActionDialog } from './ref-dpa-action-dialog'
import { DPAsImportDialog } from './ref-dpa-import-dialog'
import { useRefRefDpa } from './ref-dpa-provider'

export function DPADialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefRefDpa()

  const { mutateAsync } = useDeleteRefDPA()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync(currentRow.id.toString())

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_dpa}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <DPAsActionDialog
        key='jenis-spm-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <DPAsImportDialog
        key='ref-rekening-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <DPAsActionDialog
            key={`jenis-spm-edit-${currentRow.id}`}
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
            key={`ref-rekening-delete-${currentRow.id}`}
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
            title={`Hapus DPA Ini: ${currentRow.nm_dpa} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_dpa}</strong>. <br />
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
