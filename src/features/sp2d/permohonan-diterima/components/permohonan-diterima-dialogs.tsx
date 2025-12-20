import { useDeletePermohonanSP2D, usePutSp2DKirim } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermohonanDiterimaPeriksaDialog } from './Permohonan-diterima-periksa-dialog'
import { PermohonanDiterimaActionDialog } from './permohonan-diterima-action-dialog'
import { EditSumberDanaDialog } from './permohonan-diterima-edit-sd-dialog-action'
import { useRefSp2dItem } from './permohonan-diterima-provider'
import { PermohonanDiterimaKirimTTEDialog } from './permohonan-diterima-sp2d-tte-dialog'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSp2dItem()
  const levelAkses = localStorage.getItem('user_role')
  const { mutateAsync } = useDeletePermohonanSP2D()
  const { mutateAsync: put } = usePutSp2DKirim()

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

  const handleKirimKeBank = async () => {
    if (!currentRow) return
    const now = new Date()
    const formatted = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const formData = new FormData()
    formData.append('id', currentRow.sp2dkirim[0].id)
    formData.append('tgl_kirim_kebank', formatted)
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

  const handlePublish = async () => {
    if (!currentRow) return
    const formData = new FormData()
    formData.append('id', currentRow.sp2dkirim[0].id)
    formData.append('publish', '1')
    const kirimBankPromise = put(formData)
    await toast.promise(kirimBankPromise, {
      loading: 'Publish SP2D...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `SP2D Berhasil Di Publish Ke Bendahara`
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
          {levelAkses !== 'Bendahara' && (
            <EditSumberDanaDialog
              key={`sp2d-terima-edit-sd-${currentRow.id_sp2d}`}
              open={open === 'edit_sd'}
              onOpenChange={() => {
                setOpen('edit_sd')
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

          <ConfirmDialog
            key={`sp2d-terima-kirim-bank-${currentRow.id_sp2d}`}
            destructive={false}
            open={open === 'kirimbank'}
            onOpenChange={() => {
              setOpen('kirimbank')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleKirimKeBank}
            className='max-w-md'
            title={`Unduh File: ${currentRow.nama_file}`}
            desc={
              <>
                Kamu akan Memindahkan berkas ke Menu Kirim Bank{' '}
                <strong>{currentRow.nama_file}</strong>.
              </>
            }
            confirmText='Kirim Ke Bank'
          />

          <ConfirmDialog
            key={`sp2d-terima-publish-${currentRow.id_sp2d}`}
            destructive={false}
            open={open === 'publish'}
            onOpenChange={() => {
              setOpen('publish')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handlePublish}
            className='max-w-md'
            title={`Unduh File: ${currentRow.nama_file}`}
            desc={
              <>
                Kamu akan Mempublish Berkas SP2D{' '}
                <strong>{currentRow.nama_file}</strong>.
              </>
            }
            confirmText='Publish'
          />
        </>
      )}
    </>
  )
}
