import { useDeleteLaporanFungsional } from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { LaporanSp2bToBUDActionDialog } from './laporan-pajak-bendahara-action-dialog'
import { LaporanSp2bToBUDPeriksa } from './laporan-pajak-bendahara-periksa'
import { useRefLaporanSp2bToBUD } from './laporan-pajak-bendahara-provider'

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefLaporanSp2bToBUD()
  const { mutateAsync } = useDeleteLaporanFungsional()

  const handleDelete = async () => {
    if (!currentRow) return
    const deletePromise = mutateAsync({ id: currentRow.id.toString() })

    await toast.promise(deletePromise, {
      loading: 'Menghapus data...',
      success: () => {
        setOpen(null)
        setTimeout(() => setCurrentRow(null), 500)

        return `Data "${currentRow.refSp2bKeBud?.nm_sp2b_ke_bud}" berhasil dihapus.`
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
          `/laporan/laporan-sp2b-to-bud/download/${currentRow.id}`,
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
          `${currentRow.refSp2bKeBud?.nm_sp2b_ke_bud ?? 'laporan'}.pdf`
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
      <LaporanSp2bToBUDActionDialog
        key='laporan-fungsional-penerimaan-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <LaporanSp2bToBUDActionDialog
            key={`laporan-fungsional-penerimaan-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <LaporanSp2bToBUDPeriksa
            key={`laporan-fungsional-penerimaan-periksa-${currentRow.id}`}
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
            key={`laporan-fungsional-penerimaan-delete-${currentRow.id}`}
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
            title={`Hapus Laporan Fungsional Penerimaan Ini: ${currentRow.id} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.id}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Delete'
          />

          <ConfirmDialog
            key={`fungsional-penerimaan-lihat-${currentRow.id}`}
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
                Kamu akan mengunduh file dengan nama{' '}
                <strong>{currentRow.refSp2bKeBud?.nm_sp2b_ke_bud}</strong>.
              </>
            }
            confirmText='Lihat'
          />

          <ConfirmDialog
            key={`fungsional-penerimaan-downloadBerkas-${currentRow.id}`}
            destructive={false}
            open={open === 'downloadBerkas'}
            onOpenChange={() => {
              setOpen('downloadBerkas')
              setTimeout(() => setCurrentRow(null), 500)
            }}
            handleConfirm={handleDownload}
            className='max-w-md'
            title={`Unduh File: ${currentRow.refSp2bKeBud?.nm_sp2b_ke_bud}`}
            desc={
              <>
                Kamu akan mengunduh file dengan nama{' '}
                <strong>{currentRow.refSp2bKeBud?.nm_sp2b_ke_bud}</strong>.
              </>
            }
            confirmText='Download'
          />
        </>
      )}
    </>
  )
}
