import { useDeleteRefSumberDana } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { SumberDanasActionDialog } from './ref-sumber-dana-action-dialog'
import { SumberDanasImportDialog } from './ref-sumber-dana-import-dialog'
import { useRefSumberDana } from './ref-sumber-dana-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSumberDana()

  const { mutateAsync } = useDeleteRefSumberDana()

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

        return `Data "${currentRow.nm_ref}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <SumberDanasActionDialog
        key='ref-sumber-dana-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <SumberDanasImportDialog
        key='ref-sumber-dana-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <SumberDanasActionDialog
            key={`ref-sumber-dana-edit-${currentRow.kd_ref1}.${currentRow.kd_ref2}.${currentRow.kd_ref3}.${currentRow.kd_ref4}.${currentRow.kd_ref5}.${currentRow.kd_ref6}`}
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
            key={`ref-sumber-dana-delete-${currentRow.kd_ref1}.${currentRow.kd_ref2}.${currentRow.kd_ref3}.${currentRow.kd_ref4}.${currentRow.kd_ref5}.${currentRow.kd_ref6}`}
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
            title={`Hapus Ceklis Kelengkapan Ini: ${currentRow.nm_ref} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_ref}</strong>. <br />
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
