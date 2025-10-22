import { useDeleteRefProgram } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { ProgramsImportDialog } from './ref-program-import-dialog'
import { TasksMutateDrawer } from './ref-program-mutate-drawer'
import { useRefProgram } from './ref-program-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefProgram()
  const { mutateAsync } = useDeleteRefProgram()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_prog1: currentRow.kd_prog1,
      kd_prog2: currentRow.kd_prog2,
      kd_prog3: currentRow.kd_prog3,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_program}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <TasksMutateDrawer
        key='ref-program-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <ProgramsImportDialog
        key='ref-program-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TasksMutateDrawer
            key={`ref-program-update-${currentRow.kd_prog1}-${currentRow.kd_prog2}-${currentRow.kd_prog3}`}
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
            key='ref-program-delete'
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
            title={`Hapus Program Ini : ${currentRow.nm_program} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_program}</strong>. <br />
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
