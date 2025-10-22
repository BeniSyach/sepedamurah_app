import { useDeleteRefJenisSPM } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { CeklisSPMsActionDialog } from './ref-jenis-spm-action-dialog'
import { CeklisSPMsImportDialog } from './ref-jenis-spm-import-dialog'
import { useRefJenisSpm } from './ref-jenis-spm-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefJenisSpm()

  const { mutateAsync } = useDeleteRefJenisSPM()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync(currentRow.id)

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.kategori}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <CeklisSPMsActionDialog
        key='jenis-spm-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <CeklisSPMsImportDialog
        key='ref-rekening-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <CeklisSPMsActionDialog
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
            key={`jenis-spm-delete-${currentRow.id}`}
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
            title={`Hapus Ceklis Kelengkapan Ini: ${currentRow.kategori} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.kategori}</strong>. <br />
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
