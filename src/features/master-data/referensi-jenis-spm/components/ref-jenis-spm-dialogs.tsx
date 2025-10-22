import { useDeleteRefCeklisSPM } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { JenisSPMsActionDialog } from './ref-jenis-spm-action-dialog'
import { JenisSPMsImportDialog } from './ref-jenis-spm-import-dialog'
import { useRefDokumenCeklisKelengkapanDokumen } from './ref-jenis-spm-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useRefDokumenCeklisKelengkapanDokumen()

  const { mutateAsync } = useDeleteRefCeklisSPM()

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
      <JenisSPMsActionDialog
        key='jenis-spm-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <JenisSPMsImportDialog
        key='ref-rekening-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <JenisSPMsActionDialog
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
            title={`Hapus Jenis SPM Ini: ${currentRow.kategori} ?`}
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
