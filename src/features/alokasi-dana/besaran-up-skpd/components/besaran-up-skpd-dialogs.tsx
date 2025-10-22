import { useDeleteUPSKPD } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { UsersActionDialog } from './besaran-up-skpd-action-dialog'
import { useRefUpSkpd } from './besaran-up-skpd-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefUpSkpd()
  const { mutateAsync } = useDeleteUPSKPD()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd_opd1: currentRow.kd_opd1,
      kd_opd2: currentRow.kd_opd2,
      kd_opd3: currentRow.kd_opd3,
      kd_opd4: currentRow.kd_opd4,
      kd_opd5: currentRow.kd_opd5,
      tahun: currentRow.tahun,
    })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.pagu}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <UsersActionDialog
        key='besaran-pagu-up-skpd-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <UsersActionDialog
            key={`besaran-pagu-up-skpd-edit-${currentRow.kd_opd1}-${currentRow.kd_opd2}-${currentRow.kd_opd3}-${currentRow.kd_opd4}-${currentRow.kd_opd5}`}
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
            key={`besaran-pagu-up-skpd-delete-${currentRow.kd_opd1}-${currentRow.kd_opd2}-${currentRow.kd_opd3}-${currentRow.kd_opd4}-${currentRow.kd_opd5}`}
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
            title={`Hapus Laporan Fungsional Penerimaan Ini: ${currentRow.pagu} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.pagu}</strong>. <br />
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
