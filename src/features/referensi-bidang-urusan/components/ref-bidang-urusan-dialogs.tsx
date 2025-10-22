import { useDeleteRefBidangUrusan } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './ref-bidang-urusan-import-dialog'
import { TasksMutateDrawer } from './ref-bidang-urusan-mutate-drawer'
import { useRefBidangUrusan } from './ref-bidang-urusan-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefBidangUrusan()
  const { mutateAsync } = useDeleteRefBidangUrusan()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_bu1: currentRow.kd_bu1,
      kd_bu2: currentRow.kd_bu2,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_bu}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <TasksMutateDrawer
        key='ref-bidanng-urusan-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='ref-bidanng-urusan-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`ref-bidanng-urusan-update-${currentRow.kd_bu1}-${currentRow.kd_bu2}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='ref-bidanng-urusan-delete'
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
            title={`Hapus Bidang Urusan ini: ${currentRow.nm_bu} ?`}
            desc={
              <>
                Anda akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_bu}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Hapus'
          />
        </>
      )}
    </>
  )
}
