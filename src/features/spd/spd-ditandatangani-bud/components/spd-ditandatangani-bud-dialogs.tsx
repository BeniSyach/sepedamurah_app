import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useRefPermohonanSpd } from './spd-ditandatangani-bud-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefPermohonanSpd()

  // Fungsi download file
  const handleDownload = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/spd/spd-terkirim/downloadSPDTTE/${currentRow.id}`,
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

  return (
    <>
      {currentRow && (
        <>
          <ConfirmDialog
            key={`spd-ditandatangani-bud-download-${currentRow.id}`}
            open={open === 'download'}
            onOpenChange={() => {
              setOpen('download')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleDownload}
            className='max-w-md'
            title={`Download SPD  Ini: ${currentRow.namafile} ?`}
            desc={
              <>
                Kamu akan mengunduh file dengan nama{' '}
                <strong>{currentRow.namafile}</strong>.
              </>
            }
            confirmText='Download'
          />
          {/* <ConfirmDialog
            key={`spd-ditandatangani-bud-download-${currentRow.id}`}
            destructive
            open={open === 'cekTTE'}
            onOpenChange={() => {
              setOpen('cekTTE')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={handleDownload}
            className='max-w-md'
            title={`Download SPD TTE Ini: ${currentRow.namafile} ?`}
            desc={
              <>
                Kamu akan mengunduh file dengan nama{' '}
                <strong>{currentRow.namafile}</strong>.
              </>
            }
            confirmText='Download'
          /> */}
        </>
      )}
    </>
  )
}
