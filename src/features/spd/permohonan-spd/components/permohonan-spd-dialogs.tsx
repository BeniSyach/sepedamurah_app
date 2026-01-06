import { useDeletePermohonanSPD } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermohonanSPDsActionDialog } from './permohonan-spd-action-dialog'
import { PermohonanSPDPeriksa } from './permohonan-spd-periksa'
import { useRefPermohonanSpd } from './permohonan-spd-provider'

export function UsersDialogs() {
  const levelAkses = localStorage.getItem('user_role')
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()
  const { mutateAsync } = useDeletePermohonanSPD()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id })

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
          `/spd/permohonan-spd/download/${currentRow.id}`,
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
      <PermohonanSPDsActionDialog
        key='permohonan-spd-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <PermohonanSPDsActionDialog
            key={`permohonan-spd-edit-${currentRow.id}`}
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
            <PermohonanSPDPeriksa
              key={`permohonan-spd-periksa-${currentRow.id}`}
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
            key={`permohonan-spd-delete-${currentRow.id}`}
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
            title={`Hapus Akses Kuasa BUD Ini: ${currentRow.nama_file} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nama_file}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Delete'
          />

          <ConfirmDialog
            key={`permohonan-spd-download-${currentRow.id}`}
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
            key={`permohonan-spd-lihat-${currentRow.id}`}
            destructive={false}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleLihat}
            className='max-w-md'
            title={`Lihat File: ${currentRow.nama_file}`}
            desc={
              <>
                Kamu akan Lihat file dengan nama{' '}
                <strong>{currentRow.nama_file}</strong>.
              </>
            }
            confirmText='Lihat'
          />
        </>
      )}
    </>
  )
}
