import { useDeleteAksesAssetBendahara } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { AksesDPASKPDActionDialog } from './akses-asset-bendahara-action-dialog'
import { useRefAksesAssetBendaharaGroup } from './akses-asset-bendahara-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useRefAksesAssetBendaharaGroup()

  const { mutateAsync } = useDeleteAksesAssetBendahara()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.kode_opd })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.nama_opd}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      <AksesDPASKPDActionDialog
        key='akses-dpa-skpd-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <AksesDPASKPDActionDialog
            key={`akses-dpa-skpd-edit-${currentRow.kode_opd}`}
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
            key={`akses-dpa-skpd-delete-${currentRow.kode_opd}`}
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
            title={`Hapus SKPD Ini: ${currentRow.nama_opd} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nama_opd}</strong>. <br />
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
