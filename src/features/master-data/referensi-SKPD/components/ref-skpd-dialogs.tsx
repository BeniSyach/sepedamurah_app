import { useDeleteRefSKPD } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { SKPDsActionDialog } from './ref-skpd-action-dialog'
import { SKPDImportDialog } from './ref-skpd-import-dialog'
import { useRefMasterSkpd } from './ref-skpd-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefMasterSkpd()

  const { mutateAsync } = useDeleteRefSKPD()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_opd1: currentRow.kd_opd1,
      kd_opd2: currentRow.kd_opd2,
      kd_opd3: currentRow.kd_opd3,
      kd_opd4: currentRow.kd_opd4,
      kd_opd5: currentRow.kd_opd5,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_opd}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <SKPDsActionDialog
        key='master-skpd-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      <SKPDImportDialog
        key='master-skpd-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <SKPDsActionDialog
            key={`master-skpd-edit-${currentRow.kd_opd1}-${currentRow.kd_opd2}-${currentRow.kd_opd3}-${currentRow.kd_opd4}-${currentRow.kd_opd5}`}
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
            key={`master-skpd-delete-${currentRow.kd_opd1}-${currentRow.kd_opd2}-${currentRow.kd_opd3}-${currentRow.kd_opd4}-${currentRow.kd_opd5}`}
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
            title={`Hapus SKPD Ini: ${currentRow.nm_opd} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_opd}</strong>. <br />
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
