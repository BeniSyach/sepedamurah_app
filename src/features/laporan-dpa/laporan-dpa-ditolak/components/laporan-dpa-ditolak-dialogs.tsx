import { useDeleteLaporanDPA } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UsersActionDialog } from './laporan-dpa-ditolak-action-dialog'
import { useRefLaporanDPA } from './laporan-dpa-ditolak-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefLaporanDPA()
  const { mutateAsync } = useDeleteLaporanDPA()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id.toString() })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.dpa?.nm_dpa}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      {currentRow && (
        <>
          <UsersActionDialog
            key={`fungsional-tolak-edit-${currentRow.id.toString()}`}
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
            key={`fungsional-tolak-delete-${currentRow.id.toString()}`}
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
            title={`Hapus Fungsional Penerimaan Ini: ${currentRow.dpa?.nm_dpa} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.dpa?.nm_dpa}</strong>. <br />
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
