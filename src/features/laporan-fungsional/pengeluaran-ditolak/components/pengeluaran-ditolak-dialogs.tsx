import { useDeleteLaporanFungsional } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UsersActionDialog } from './pengeluaran-ditolak-action-dialog'
import { useRefLaporanFungsional } from './pengeluaran-ditolak-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefLaporanFungsional()
  const { mutateAsync } = useDeleteLaporanFungsional()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.jenis_berkas}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }
  return (
    <>
      <UsersActionDialog
        key='fungsional-pengeluaran-tolak-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`fungsional-pengeluaran-tolak-edit-${currentRow.id}`}
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
            key={`fungsional-pengeluaran-tolak-delete-${currentRow.id}`}
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
            title={`Hapus Akses Kuasa BUD Ini: ${currentRow.jenis_berkas} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.jenis_berkas}</strong>. <br />
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
