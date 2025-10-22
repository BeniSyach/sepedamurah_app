import { toast } from 'sonner'
import { useDeleteUsers } from '@/api/users/use-del-users'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UsersActionDialog } from './users-action-dialog'
import { useUsers } from './users-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useUsers()
  const { mutateAsync } = useDeleteUsers()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      id: currentRow.id,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.name}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }
  return (
    <>
      <UsersActionDialog
        key='user-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`user-edit-${currentRow.id}`}
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
            key='user-delete'
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
            title={`Hapus Bidang Urusan ini: ${currentRow.name} ?`}
            desc={
              <>
                Anda akan menghapus data dengan nama{' '}
                <strong>{currentRow.name}</strong>. <br />
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
