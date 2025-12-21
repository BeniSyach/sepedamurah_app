import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PenerimaanPeriksa } from './berkas-masuk-dpa-action-dialog'
import { useRefLaporanSp2bToBUD } from './berkas-masuk-dpa-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefLaporanSp2bToBUD()

  // Fungsi preview file di tab baru
  const handlePreview = async () => {
    if (!currentRow) return

    await toast.promise(
      (async () => {
        const response = await api.get(
          `/laporan/laporan-sp2b-to-bud/download/${currentRow.id}`,
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
          <PenerimaanPeriksa
            key={`berkas-masuk-penerimaan-periksa-${currentRow.id}`}
            open={open === 'periksa'}
            onOpenChange={() => {
              setOpen('periksa')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key={`berkas-masuk-penerimaan-lihat-${currentRow.id}`}
            destructive={false}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handlePreview}
            className='max-w-md'
            title={`Unduh File: ${currentRow.refSp2bKeBud?.nm_sp2b_ke_bud}`}
            desc={
              <>
                Kamu akan Melihat file dengan nama{' '}
                <strong>{currentRow.refSp2bKeBud?.nm_sp2b_ke_bud}</strong>.
              </>
            }
            confirmText='Lihat'
          />
        </>
      )}
    </>
  )
}
