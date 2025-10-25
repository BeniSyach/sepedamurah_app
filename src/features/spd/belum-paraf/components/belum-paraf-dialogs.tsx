import { useDeletePermohonanSPD } from '@/api'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRefPermohonanSpd } from './belum-paraf-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()
  const { mutateAsync } = useDeletePermohonanSPD()

  const handleterima = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id })

    await toast.promise(deletePromise, {
      loading: 'SPD Diterima...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data SPD Berhasil Diterima.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  const handletolak = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id })

    await toast.promise(deletePromise, {
      loading: 'SPD Ditolak...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data SPD Berhasil Ditolak.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  return (
    <>
      {currentRow && (
        <>
          <ConfirmDialog
            key={`spd-ditandatangani-bud-terima-${currentRow.id}`}
            destructive
            open={open === 'terima'}
            onOpenChange={() => {
              setOpen('terima')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleterima}
            className='max-w-md'
            title={`Terima SPD Ini: ${currentRow.keterangan} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.keterangan}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Terima'
          />
          <ConfirmDialog
            key={`spd-ditandatangani-bud-tolak-${currentRow.id}`}
            destructive
            open={open === 'tolak'}
            onOpenChange={() => {
              setOpen('tolak')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handletolak}
            className='max-w-md'
            title={`Tolak SPD Ini: ${currentRow.keterangan} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.keterangan}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Tolak'
          />
        </>
      )}
    </>
  )
}
