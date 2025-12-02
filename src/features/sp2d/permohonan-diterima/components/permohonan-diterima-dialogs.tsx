import { useDeletePermohonanSP2D } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermohonanDiterimaPeriksaDialog } from './Permohonan-diterima-periksa-dialog'
import { PermohonanDiterimaActionDialog } from './permohonan-diterima-action-dialog'
import { useRefSp2dItem } from './permohonan-diterima-provider'
import { PermohonanDiterimaKirimTTEDialog } from './permohonan-diterima-sp2d-tte-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSp2dItem()
  const { mutateAsync } = useDeletePermohonanSP2D()
  const levelAkses = localStorage.getItem('user_role')
  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id_sp2d })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data berhasil dihapus.`
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
          `/sp2d/permohonan-sp2d/download/${currentRow.id_sp2d}`,
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

        // Tutup dialog setelah download berhasil x
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

  return (
    <>
      <PermohonanDiterimaActionDialog
        key='permohonan-sp2d-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <PermohonanDiterimaActionDialog
            key={`permohonan-sp2d-edit-${currentRow.id_sp2d}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
          {levelAkses !== 'Bendahara' && (
            <PermohonanDiterimaKirimTTEDialog
              key={`sp2d-terima-TTE-${currentRow.id_sp2d}`}
              open={open === 'kirimsp2d'}
              onOpenChange={() => {
                setOpen('kirimsp2d')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={currentRow}
            />
          )}
          {levelAkses !== 'Bendahara' && (
            <PermohonanDiterimaPeriksaDialog
              key={`sp2d-terima-periksa-${currentRow.id_sp2d}`}
              open={open === 'periksa'}
              onOpenChange={() => {
                setOpen('periksa')
                setTimeout(() => {
                  setCurrentRow(null)
                }, 500)
              }}
              currentRow={currentRow}
            />
          )}
          <ConfirmDialog
            key={`permohonan-sp2d-delete-${currentRow.id_sp2d}`}
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
            title={`Hapus Sp2d Ini: ${currentRow.jenis_berkas} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.jenis_berkas}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Delete'
          />

          <ConfirmDialog
            key={`sp2d-terima-download-${currentRow.id_sp2d}`}
            destructive={false}
            open={open === 'download'}
            onOpenChange={() => {
              setOpen('download')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleDownload}
            className='max-w-md'
            title={`Unduh File: ${currentRow.nama_file}`}
            desc={
              <>
                Kamu akan mengunduh file dengan nama{' '}
                <strong>{currentRow.nama_file}</strong>.
              </>
            }
            confirmText='Download'
          />
          <ConfirmDialog
            key={`sp2d-terima-lihat-${currentRow.id_sp2d}`}
            destructive={false}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleLihat}
            className='max-w-md'
            title={`Unduh File: ${currentRow.nama_file}`}
            desc={
              <>
                Kamu akan Lihat file dengan nama{' '}
                <strong>{currentRow.nama_file}</strong>.
              </>
            }
            confirmText='Lihat'
          />
          <ConfirmDialog
            key={`sp2d-terima-lihat-tte-${currentRow.id_sp2d}`}
            destructive={false}
            open={open === 'downloadTTE'}
            onOpenChange={() => {
              setOpen('downloadTTE')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleLihatTTE}
            className='max-w-md'
            title={`Unduh File: ${currentRow.nama_file}`}
            desc={
              <>
                Kamu akan Lihat file yang sudah ditandatangani secara Elektronik
                dengan nama <strong>{currentRow.nama_file}</strong>.
              </>
            }
            confirmText='Lihat'
          />
        </>
      )}
    </>
  )
}
