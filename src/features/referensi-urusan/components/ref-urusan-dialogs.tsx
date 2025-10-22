import { useDeleteRefUrusan } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './ref-urusan-import-dialog'
import { TasksMutateDrawer } from './ref-urusan-mutate-drawer'
import { useRefUrusan } from './ref-urusan-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefUrusan()
  const { mutateAsync } = useDeleteRefUrusan()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync(currentRow.kd_urusan)

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_urusan}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <TasksMutateDrawer
        key='ref-urusan-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='ref-urusan-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`ref-urusan-update-${currentRow.kd_urusan}`}
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
            key='ref-urusan-delete'
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
            title={`Hapus data ini: ${currentRow.nm_urusan}?`}
            desc={
              <>
                Anda akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_urusan}</strong>. <br />
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
