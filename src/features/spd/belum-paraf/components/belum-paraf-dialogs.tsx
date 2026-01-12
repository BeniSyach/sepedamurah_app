import { usePutPermohonanSpd, usePutSpdTerkirim } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRefPermohonanSpd } from './belum-paraf-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()
  const { mutateAsync: putSPDTerkirimAsync } = usePutSpdTerkirim()
  const { mutateAsync: putPermohonanSPDAsync } = usePutPermohonanSpd()
  const user = useAuthStore((s) => s.user)

  const handleterima = async () => {
    if (!currentRow) return
    const now = new Date()
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const formData = new FormData()
    formData.append('id', currentRow.id)
    formData.append('tgl_paraf', formatted)
    formData.append('paraf_kbud', '1')
    const updateSPDTerkirim = putSPDTerkirimAsync(formData)

    await toast.promise(updateSPDTerkirim, {
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
    formData.append('proses', '0')
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
        return err
      },
    })
  }

  // Fungsi lihat file
  const handleLihat = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/spd/permohonan-spd/download/${currentRow.id}`,
          {
            responseType: 'blob',
            params: { t: Date.now() },
          }
        )

        // Tentukan MIME type sesuai file
        let mimeType = 'application/pdf' // default PDF
        if (currentRow.nama_file_asli?.endsWith('.docx'))
          mimeType =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        else if (currentRow.nama_file_asli?.endsWith('.doc'))
          mimeType = 'application/msword'

        const url = window.URL.createObjectURL(
          new Blob([response.data], { type: mimeType })
        )
        window.open(url, '_blank')

        setTimeout(() => window.URL.revokeObjectURL(url), 5000)
      })(),
      {
        loading: 'Membuka file...',
        success: 'File berhasil dibuka!',
        error: 'Gagal membuka file.',
      }
    )
  }

  return (
    <>
      {currentRow && (
        <>
          <ConfirmDialog
            key={`belum-paraf-kbud-terima-${currentRow.id}`}
            open={open === 'terima'}
            onOpenChange={() => {
              setOpen('terima')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleterima}
            className='max-w-md'
            title={`Terima SPD Ini: ${currentRow.namafile} ?`}
            desc={
              <>
                Apakah Anda akan Menverifikasi SPD ini
                <strong>{currentRow.namafile} ?</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Terima'
          />
          <ConfirmDialog
            key={`belum-paraf-kbud-tolak-${currentRow.id}`}
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
            title={`Tolak SPD Ini: ${currentRow.namafile} ?`}
            desc={
              <>
                Kamu akan Menolak SPD ini
                <strong>{currentRow.namafile}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Tolak'
          />
          <ConfirmDialog
            key={`permohonan-spd-lihat-${currentRow.id}`}
            destructive={false}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleLihat}
            className='max-w-md'
            title={`Lihat File: ${currentRow.namafile}`}
            desc={
              <>
                Kamu akan Lihat file dengan nama{' '}
                <strong>{currentRow.namafile}</strong>.
              </>
            }
            confirmText='Lihat'
          />
        </>
      )}
    </>
  )
}
