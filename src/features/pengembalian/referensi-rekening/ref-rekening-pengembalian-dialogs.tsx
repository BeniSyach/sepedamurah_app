import { useDeleteDatRekening } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UsersActionDialog } from './ref-rekening-pengembalian-action-dialog'
import { useRefDatRekeningItem } from './ref-rekening-pengembalian-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefDatRekeningItem()
  const { mutateAsync } = useDeleteDatRekening()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      tahun: currentRow.tahun_rek,
      kd_rek1: currentRow.kd_rek1,
      kd_rek2: currentRow.kd_rek2,
      kd_rek3: currentRow.kd_rek3,
      kd_rek4: currentRow.kd_rek4,
      kd_rek5: currentRow.kd_rek5,
      kd_rek6: currentRow.kd_rek6,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nm_rekening}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }
  return (
    <>
      <UsersActionDialog
        key='ref-rekening-pengembalian-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`ref-rekening-pengembalian-edit-${currentRow.kd_rek1}-${currentRow.kd_rek2}-${currentRow.kd_rek3}-${currentRow.kd_rek4}-${currentRow.kd_rek5}-${currentRow.kd_rek6}`}
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
            key={`ref-rekening-pengembaliana-delete-${currentRow.kd_rek1}-${currentRow.kd_rek2}-${currentRow.kd_rek3}-${currentRow.kd_rek4}-${currentRow.kd_rek5}-${currentRow.kd_rek6}`}
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
            title={`Hapus Referensi Rekening Pengembalian Ini: ${currentRow.nm_rekening} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nm_rekening}</strong>. <br />
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
