import { useDeleteLaporanDPA } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PenerimaanPeriksa } from '../../laporan-dpa-diterima/components/laporan-dpa-diterima-action-dialog'
import { UsersActionDialog } from './laporan-dpa-ditolak-action-dialog'
import { useRefLaporanRekonsiliasiGajiSKPD } from './laporan-dpa-ditolak-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } =
    useRefLaporanRekonsiliasiGajiSKPD()
  const { mutateAsync } = useDeleteLaporanDPA()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id.toString() })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.RekonsiliasiGajiSKPD?.nm_rekonsiliasi_gaji_skpd}" berhasil dihapus.`
      },
      error: (err) => {
        return err.data.message
      },
    })
  }

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
          <UsersActionDialog
            key={`dpa-tolak-edit-${currentRow.id.toString()}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key={`dpa-tolak-delete-${currentRow.id.toString()}`}
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
            title={`Hapus Fungsional Penerimaan Ini: ${currentRow.RekonsiliasiGajiSKPD?.nm_rekonsiliasi_gaji_skpd} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>
                  {currentRow.RekonsiliasiGajiSKPD?.nm_rekonsiliasi_gaji_skpd}
                </strong>
                . <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Delete'
          />

          <ConfirmDialog
            key={`dpa-tolak-lihat-${currentRow.id}`}
            destructive={false}
            open={open === 'lihat'}
            onOpenChange={() => {
              setOpen('lihat')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handlePreview}
            className='max-w-md'
            title={`Unduh File: ${currentRow.RekonsiliasiGajiSKPD?.nm_rekonsiliasi_gaji_skpd}`}
            desc={
              <>
                Kamu akan melihat file dengan nama{' '}
                <strong>
                  {currentRow.RekonsiliasiGajiSKPD?.nm_rekonsiliasi_gaji_skpd}
                </strong>
                .
              </>
            }
            confirmText='Lihat'
          />

          <PenerimaanPeriksa
            key={`dpa-tolak-periksa-${currentRow.id}`}
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
