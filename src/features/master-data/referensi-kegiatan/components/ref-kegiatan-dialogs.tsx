import { useDeleteRefKegiatan } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { TasksImportDialog } from './ref-kegiatan-import-dialog'
import { KegiatansMutateDrawer } from './ref-kegiatan-mutate-drawer'
import { useRefKegiatan } from './ref-kegiatan-provider'

export function TasksDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefKegiatan()
  const { mutateAsync } = useDeleteRefKegiatan()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_keg1: currentRow.kd_keg1,
      kd_keg2: currentRow.kd_keg2,
      kd_keg3: currentRow.kd_keg3,
      kd_keg4: currentRow.kd_keg4,
      kd_keg5: currentRow.kd_keg5,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_kegiatan}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <KegiatansMutateDrawer
        key='ref-kegiatan-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TasksImportDialog
        key='ref-kegiatan-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <KegiatansMutateDrawer
            key={`ref-kegiatan-update-${currentRow.kd_keg1}-${currentRow.kd_keg2}-${currentRow.kd_keg3}-${currentRow.kd_keg4}-${currentRow.kd_keg5}`}
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
            key='ref-kegiatan-delete'
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
            title={`Hapus Kegiatan Ini: ${currentRow.nm_kegiatan} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_kegiatan}</strong>. <br />
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
