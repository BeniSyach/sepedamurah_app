import { useDeleteSPDTerkirim, usePutSpdTerkirim } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermohonanDiterimaActionDialog } from './permohonan-diterima-action-dialog'
import { PermohonanDiterimaSPDPeriksa } from './permohonan-diterima-periksa'
import { useRefPermohonanSpd } from './permohonan-diterima-provider'
import { PermohonanDiterimaSPDTTE } from './permohonan-diterima-spd-tte'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()

  const { mutateAsync: put } = usePutSpdTerkirim()
  const { mutateAsync: del } = useDeleteSPDTerkirim()

  const handleHapus = async () => {
    if (!currentRow) return
    const HapusPromise = del({ id: currentRow.id })
    await toast.promise(HapusPromise, {
      loading: 'Hapus SPD...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `SPD Berhasil Di Hapus`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  const handlePublish = async () => {
    if (!currentRow) return
    const formData = new FormData()
    formData.append('id', currentRow.id)
    formData.append('publish', '1')
    const kirimBankPromise = put(formData)
    await toast.promise(kirimBankPromise, {
      loading: 'Publish SPD...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `SPD Berhasil Di Publish Ke Bendahara`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

  // Fungsi download file
  const handleDownload = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/spd/spd-terkirim/download/${currentRow.id}`,
          {
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            params: {
              t: Date.now(), // tambahkan query timestamp supaya cache benar-benar dilewati
            },
          }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', currentRow.nama_file_asli)
        document.body.appendChild(link)
        link.click()
        link.remove()

        // Tutup dialog setelah download berhasil
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)
      })(),
      {
        loading: 'Mengunduh file...',
        success: 'File berhasil diunduh!',
        error: 'Gagal mengunduh file.',
      }
    )
  }

  // Fungsi lihat file
  const handleLihat = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/spd/spd-terkirim/download/${currentRow.id}`,
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

  const handleLihatTTE = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/spd/spd-terkirim/downloadSPDTTE/${currentRow.id}`,
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
      <PermohonanDiterimaActionDialog
        key='spd-diterima-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <PermohonanDiterimaSPDPeriksa
            key={`spd-diterima-periksa-${currentRow.id}`}
            open={open === 'periksa'}
            onOpenChange={() => {
              setOpen('periksa')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <PermohonanDiterimaSPDTTE
            key={`spd-diterima-tte-${currentRow.id}`}
            open={open === 'kirimspd'}
            onOpenChange={() => {
              setOpen('kirimspd')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key={`spd-hapus-terkirim-${currentRow.id}`}
            destructive
            open={open === 'hapus'}
            onOpenChange={() => {
              setOpen('hapus')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleHapus}
            className='max-w-md'
            title={`Hapus Data: ${currentRow.namafile}`}
            desc={
              <>
                Kamu akan Menghapus Berkas SPD{' '}
                <strong>{currentRow.namafile}</strong>.
              </>
            }
            confirmText='Hapus'
          />

          <ConfirmDialog
            key={`spd-diterima-publish-${currentRow.id}`}
            destructive={false}
            open={open === 'publish'}
            onOpenChange={() => {
              setOpen('publish')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handlePublish}
            className='max-w-md'
            title={`Unduh File: ${currentRow.namafile}`}
            desc={
              <>
                Kamu akan Mempublish Berkas SPD{' '}
                <strong>{currentRow.namafile}</strong>.
              </>
            }
            confirmText='Publish'
          />

          <ConfirmDialog
            key={`spd-diterima-download-${currentRow.id}`}
            destructive={false}
            open={open === 'download'}
            onOpenChange={() => {
              setOpen('download')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleDownload}
            className='max-w-md'
            title={`Unduh File: ${currentRow.namafile}`}
            desc={
              <>
                Kamu akan mengunduh file dengan nama{' '}
                <strong>{currentRow.namafile}</strong>.
              </>
            }
            confirmText='Download'
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
          <ConfirmDialog
            key={`permohonan-spd-lihat-TTE-${currentRow.id}`}
            destructive={false}
            open={open === 'lihatTTE'}
            onOpenChange={() => {
              setOpen('lihatTTE')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleLihatTTE}
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
