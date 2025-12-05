import { usePutPermohonanSp2d, usePutSp2DKirim } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { useAuthStore } from '@/stores/auth-store'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRefSp2dItem } from './sp2d-kirim-bank-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSp2dItem()
  const { mutateAsync } = usePutPermohonanSp2d()
  const { mutateAsync: put } = usePutSp2DKirim()

  const handleTolak = async () => {
    const now = new Date()
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const user = useAuthStore.getState().user
    if (!user) {
      toast.error('User belum login.')
      return
    }
    if (!currentRow) return
    const formData = new FormData()
    formData.append('id_sp2d', currentRow.id_sp2d)
    formData.append('id_operator', user.id.toString())
    formData.append('nama_operator', user.name)
    const alasan = prompt('Masukkan alasan penolakan:')
    if (!alasan) return toast.error('Alasan wajib diisi.')
    formData.append('proses', '0')
    formData.append('alasan_tolak', alasan)
    formData.append('ditolak', formatted)
    formData.append('diterima', '')
    const tolakPromise = mutateAsync(formData)

    await toast.promise(tolakPromise, {
      loading: 'Menolak SP2D...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Sp2d berhasil ditolak.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }
  // Fungsi lihat file
  const handleLihat = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/sp2d/permohonan-sp2d/download/${currentRow.id_sp2d}`,
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

  // Fungsi lihat file TTE
  const handleLihatTTE = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/sp2d/sp2d-kirim/downloadTTE/${currentRow.sp2dkirim[0].id}`,
          {
            responseType: 'blob',
            params: { t: Date.now() },
          }
        )

        // Tentukan MIME type sesuai file
        let mimeType = 'application/pdf' // default PDF
        if (currentRow.sp2dkirim[0].file_tte?.endsWith('.docx'))
          mimeType =
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        else if (currentRow.sp2dkirim[0].file_tte?.endsWith('.doc'))
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

  const handleKembalikan = async () => {
    if (!currentRow) return
    const formData = new FormData()
    formData.append('id', currentRow.sp2dkirim[0].id)
    formData.append('tgl_kirim_kebank', 'NULL')
    const kirimBankPromise = put(formData)
    await toast.promise(kirimBankPromise, {
      loading: 'Kirim Ke Bank...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data berhasil Berpindah Ke Menu Kirim Bank.`
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
            key={`sp2d-kirim-bank-lihat-berkas-tte-${currentRow.id_sp2d}`}
            open={open === 'lihat_tte'}
            onOpenChange={() => {
              setOpen('lihat_tte')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleLihatTTE}
            className='max-w-md'
            title={`Lihat SP2D TTE Ini: ${currentRow.jenis_berkas} ?`}
            desc={
              <>
                Kamu akan Melihat berkas SP2D yg telah di TTE dengan nama{' '}
                <strong>{currentRow.jenis_berkas}</strong>.
              </>
            }
            confirmText='Lihat'
          />

          <ConfirmDialog
            key={`sp2d-kirim-bank-lihat-berkas-sp2d-${currentRow.id_sp2d}`}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleLihat}
            className='max-w-md'
            title={`Lihat SP2D TTE Ini: ${currentRow.jenis_berkas} ?`}
            desc={
              <>
                Kamu akan Melihat SP2D dengan nama{' '}
                <strong>{currentRow.jenis_berkas}</strong>.
              </>
            }
            confirmText='Lihat'
          />

          <ConfirmDialog
            key={`sp2d-tte-tolak-${currentRow.id_sp2d}`}
            destructive
            open={open === 'tolak'}
            onOpenChange={() => {
              setOpen('tolak')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleTolak}
            className='max-w-md'
            title={`Tolak SP2D dengan nama : ${currentRow.jenis_berkas} ?`}
            desc={
              <>
                Kamu akan Menolak SP2D dengan nama{' '}
                <strong>{currentRow.jenis_berkas}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Tolak'
          />

          <ConfirmDialog
            key={`sp2d-terima-kirim-bank-${currentRow.id_sp2d}`}
            destructive={false}
            open={open === 'kirim_balik'}
            onOpenChange={() => {
              setOpen('kirim_balik')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleKembalikan}
            className='max-w-md'
            title={`Unduh File: ${currentRow.nama_file}`}
            desc={
              <>
                Kamu akan Memulangkan Berkas{' '}
                <strong>{currentRow.nama_file}</strong>.
              </>
            }
            confirmText='Kembalikan Ke Menu permohonan Diterima'
          />
        </>
      )}
    </>
  )
}
