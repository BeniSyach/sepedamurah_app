import { useDeleteRefSubKegiatan } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './ref-subkegiatan-import-dialog'
import { SubKegiatansMutateDrawer } from './ref-subkegiatan-mutate-drawer'
import { useRefSubKegiatan } from './ref-subkegiatan-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSubKegiatan()
  const { mutateAsync } = useDeleteRefSubKegiatan()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_subkeg1: currentRow.kd_subkeg1,
      kd_subkeg2: currentRow.kd_subkeg2,
      kd_subkeg3: currentRow.kd_subkeg3,
      kd_subkeg4: currentRow.kd_subkeg4,
      kd_subkeg5: currentRow.kd_subkeg5,
      kd_subkeg6: currentRow.kd_subkeg6,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_subkegiatan}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <SubKegiatansMutateDrawer
        key='ref-subkegiatan-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='ref-subkegiatan-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <SubKegiatansMutateDrawer
            key={`ref-subkegiatan-update-${currentRow.kd_subkeg1}-${currentRow.kd_subkeg2}-${currentRow.kd_subkeg3}-${currentRow.kd_subkeg4}-${currentRow.kd_subkeg5}-${currentRow.kd_subkeg6}`}
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
            key='ref-subkegiatan-delete'
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
            title={`Hapus Sub Kegiatan Ini: ${currentRow.nm_subkegiatan} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_subkegiatan}</strong>. <br />
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
