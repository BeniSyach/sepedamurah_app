import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PenerimaanPeriksa } from './laporan-dpa-diterima-action-dialog'
import { useRefLaporanPajakBendahara } from './laporan-dpa-diterima-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useRefLaporanPajakBendahara()
  // Fungsi download file
  const handleDownload = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/laporan/laporan-pajak-bendahara/download/${currentRow.id}`,
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
        link.setAttribute(
          'download',
          `${currentRow.refPajakBendahara?.nm_pajak_bendahara ?? 'laporan'}.pdf`
        )
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

  // Fungsi preview file di tab baru
  const handlePreview = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/laporan/laporan-pajak-bendahara/download/${currentRow.id}`,
          {
            responseType: 'blob',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              Pragma: 'no-cache',
              Expires: '0',
            },
            params: {
              t: Date.now(), // bypass cache
            },
          }
        )

        const fileBlob = new Blob([response.data], { type: response.data.type })
        const fileUrl = window.URL.createObjectURL(fileBlob)

        // Buka file di tab baru
        window.open(fileUrl, '_blank', 'noopener,noreferrer')

        // Tutup dialog
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)
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
            key={`penerimaan-diterima-lihat-${currentRow.id}`}
            destructive={false}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handlePreview}
            className='max-w-md'
            title={`Unduh File: ${currentRow.refPajakBendahara?.nm_pajak_bendahara}`}
            desc={
              <>
                Kamu akan melihat file dengan nama{' '}
                <strong>
                  {currentRow.refPajakBendahara?.nm_pajak_bendahara}
                </strong>
                .
              </>
            }
            confirmText='Lihat'
          />

          <ConfirmDialog
            key={`penerimaan-diterima-download-${currentRow.id}`}
            destructive={false}
            open={open === 'download'}
            onOpenChange={() => {
              setOpen('download')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleDownload}
            className='max-w-md'
            title={`Unduh File: ${currentRow.refPajakBendahara?.nm_pajak_bendahara}`}
            desc={
              <>
                Kamu akan mengunduh file dengan nama{' '}
                <strong>
                  {currentRow.refPajakBendahara?.nm_pajak_bendahara}
                </strong>
                .
              </>
            }
            confirmText='download'
          />

          <PenerimaanPeriksa
            key={`Fungsional-diterima-periksa-${currentRow.id}`}
            open={open === 'periksa'}
            onOpenChange={() => {
              setOpen('periksa')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}
