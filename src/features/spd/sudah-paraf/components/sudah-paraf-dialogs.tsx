import { usePutPermohonanSpd } from '@/api'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRefPermohonanSpd } from './sudah-paraf-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()
  const { mutateAsync: putPermohonanSPDAsync } = usePutPermohonanSpd()
  const user = useAuthStore((s) => s.user)

  const handletolak = async () => {
    if (!currentRow) return
    if (!user) {
      toast.error('User belum login.')
      return
    }
    const now = new Date()
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const formData = new FormData()
    formData.append('id', currentRow.id_berkas ?? '')
    formData.append('id_operator', user.id.toString())
    formData.append('nama_operator', user.name ?? '')
    const alasan = prompt('Masukkan alasan penolakan:')
    if (!alasan) return toast.error('Alasan wajib diisi.')
    formData.append('proses', 'Ditolak')
    formData.append('alasan_tolak', alasan)
    formData.append('ditolak', formatted)
    formData.append('diterima', '')
    const updateSPDTerkirim = putPermohonanSPDAsync(formData)

    await toast.promise(updateSPDTerkirim, {
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
            key={`spd-sudah-paraf-tolak-${currentRow.id}`}
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
                Kamu akan Menolak SPD ini
                <strong>{currentRow.namafile}</strong>. <br />
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
