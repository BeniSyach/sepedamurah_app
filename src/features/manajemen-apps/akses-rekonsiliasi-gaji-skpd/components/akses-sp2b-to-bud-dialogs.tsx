import { useDeleteAksesRefRekonsiliasiGajiSkpd } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { AksesRekonsiliasiGajiSkpdActionDialog } from './akses-sp2b-to-bud-action-dialog'
import { useRefAksesRefRekonsiliasiGajiSkpdGroup } from './akses-sp2b-to-bud-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useRefAksesRefRekonsiliasiGajiSkpdGroup()

  const { mutateAsync } = useDeleteAksesRefRekonsiliasiGajiSkpd()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({
      kd1: currentRow.kd_opd1,
      kd2: currentRow.kd_opd2,
      kd3: currentRow.kd_opd3,
      kd4: currentRow.kd_opd4,
      kd5: currentRow.kd_opd5,
      tahun: currentRow.tahun, // pastikan ada field tahun
    })

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
      <AksesRekonsiliasiGajiSkpdActionDialog
        key='akses-dpa-skpd-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <AksesRekonsiliasiGajiSkpdActionDialog
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
