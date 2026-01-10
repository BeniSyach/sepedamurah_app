import { useState, useEffect } from 'react'
import {
  type CekLaporanAssetBendaharaItem,
  type CekLaporanDPAItem,
  type CekLaporanPajakBendaharaItem,
  type CekLaporanSp2bToBUDItem,
  useCekLaporanAssetBendahara,
  useCekLaporanDPA,
  useCekLaporanPajakBendahara,
  useCekLaporanSp2bToBUD,
  useCekUploadFungsional,
  useDeletePermohonanSP2D,
  useGetBatasWaktu,
} from '@/api'
import { toast } from 'sonner'
import { api } from '@/api/common/client'
import { useAuthStore } from '@/stores/auth-store'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { PermohonanPenerbitanPeriksaDialog } from './permohonan-penerbitan-periksa-dialog'
import { PermohonanPenerbitanSP2DActionDialog } from './permohonan-penerbitan-sp2d-action-dialog'
import { useRefSp2dItem } from './permohonan-penerbitan-sp2d-provider'

const today = new Date()
const hariInggris = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const hariIni = hariInggris[today.getDay()]
const currentYear = today.getFullYear()
const currentMonth = today.getMonth() + 1

export function UsersDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useRefSp2dItem()
  const { mutateAsync } = useDeletePermohonanSP2D()
  const levelAkses = localStorage.getItem('user_role')
  const user = useAuthStore((s) => s.user)
  // console.log('data user', user?.skpd.status_penerimaan)
  const [showClosedDialog, setShowClosedDialog] = useState(false)
  const [closedReason, setClosedReason] = useState('')
  const { data: dataBatasWaktu } = useGetBatasWaktu({
    kd_opd1: user?.kd_opd1,
    kd_opd2: user?.kd_opd2,
    kd_opd3: user?.kd_opd3,
    kd_opd4: user?.kd_opd4,
    kd_opd5: user?.kd_opd5,
    search: hariIni,
  })
  const { data: cekUpload } = useCekUploadFungsional({
    tahun: currentYear,
    bulan: currentMonth,
    kd_opd1: user?.kd_opd1 ?? '',
    kd_opd2: user?.kd_opd2 ?? '',
    kd_opd3: user?.kd_opd3 ?? '',
    kd_opd4: user?.kd_opd4 ?? '',
    kd_opd5: user?.kd_opd5 ?? '',
    status: user?.skpd.status_penerimaan ?? '0', // 0 atau 1
  })
  const { data: useDPA } = useCekLaporanDPA({
    tahun: currentYear,
    kd_opd1: user?.kd_opd1 ?? '',
    kd_opd2: user?.kd_opd2 ?? '',
    kd_opd3: user?.kd_opd3 ?? '',
    kd_opd4: user?.kd_opd4 ?? '',
    kd_opd5: user?.kd_opd5 ?? '',
  })
  const { data: usePajakBendahara } = useCekLaporanPajakBendahara({
    tahun: currentYear,
    kd_opd1: user?.kd_opd1 ?? '',
    kd_opd2: user?.kd_opd2 ?? '',
    kd_opd3: user?.kd_opd3 ?? '',
    kd_opd4: user?.kd_opd4 ?? '',
    kd_opd5: user?.kd_opd5 ?? '',
  })
  const { data: useAssetBendahara } = useCekLaporanAssetBendahara({
    tahun: currentYear,
    kd_opd1: user?.kd_opd1 ?? '',
    kd_opd2: user?.kd_opd2 ?? '',
    kd_opd3: user?.kd_opd3 ?? '',
    kd_opd4: user?.kd_opd4 ?? '',
    kd_opd5: user?.kd_opd5 ?? '',
  })
  const { data: useSp2bToBUD } = useCekLaporanSp2bToBUD({
    tahun: currentYear,
    kd_opd1: user?.kd_opd1 ?? '',
    kd_opd2: user?.kd_opd2 ?? '',
    kd_opd3: user?.kd_opd3 ?? '',
    kd_opd4: user?.kd_opd4 ?? '',
    kd_opd5: user?.kd_opd5 ?? '',
  })

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

  const isServiceClosed = () => {
    const today = new Date().getDay() // 0 = Minggu, 6 = Sabtu

    // Jika tidak ada jadwal & hari Sabtu/Minggu => CLOSED
    if (!dataBatasWaktu || !dataBatasWaktu.data?.length) {
      if (today === 0 || today === 6) {
        return {
          closed: true,
          reason: 'Pelayanan tidak tersedia pada hari Sabtu dan Minggu.',
        }
      }

      // Hari biasa tapi jadwal tidak ditemukan
      return { closed: true, reason: 'Jadwal pelayanan tidak ditemukan.' }
    }

    // --- logic existing di bawah ---
    const now = new Date()
    const [hours, minutes] = [now.getHours(), now.getMinutes()]

    const item = dataBatasWaktu.data[0]
    const parseTime = (time: string) => {
      const [h, m] = time.split(':').map(Number)
      return h * 60 + m
    }

    const nowMinutes = hours * 60 + minutes
    const mulai = parseTime(item.waktu_awal)
    const akhir = parseTime(item.waktu_akhir)
    const istirahatAwal = parseTime(item.istirahat_awal)
    const istirahatAkhir = parseTime(item.istirahat_akhir)

    if (nowMinutes < mulai) {
      return {
        closed: true,
        reason: `Belum buka. Jam buka pukul ${item.waktu_awal}`,
      }
    }
    if (nowMinutes >= istirahatAwal && nowMinutes <= istirahatAkhir) {
      return {
        closed: true,
        reason: `Sedang istirahat pukul ${item.istirahat_awal} - ${item.istirahat_akhir}`,
      }
    }
    if (nowMinutes > akhir) {
      return {
        closed: true,
        reason: `Pelayanan sudah tutup pukul ${item.waktu_akhir}`,
      }
    }

    return { closed: false, reason: '' }
  }

  // Fungsi cek upload (sesuai dengan response backend)
  const isUploadNotAllowed = () => {
    if (!cekUpload) return { blocked: false, reason: '' }

    const reasons: string[] = []

    // Pengeluaran
    if (cekUpload.missing_pengeluaran.length > 0) {
      const listBulan = cekUpload.missing_pengeluaran
        .map((b) => `Bulan ${b}`)
        .join(', ')

      reasons.push(
        `Anda belum upload laporan fungsional (Pengeluaran) pada: ${listBulan}.`
      )
    }

    // Penerimaan (hanya jika status penerimaan = 1)
    if (
      user?.skpd.status_penerimaan == '1' &&
      cekUpload.missing_penerimaan.length > 0
    ) {
      const listBulan = cekUpload.missing_penerimaan
        .map((b) => `Bulan ${b}`)
        .join(', ')

      reasons.push(
        `Anda belum upload laporan fungsional (Penerimaan) pada: ${listBulan}.`
      )
    }

    // Jika ada minimal 1 masalah → block
    if (reasons.length > 0) {
      return {
        blocked: true,
        reason: reasons.join(' | '), // atau '\n' jika mau multiline
      }
    }

    return { blocked: false, reason: '' }
  }

  const isDPAIncomplete = () => {
    if (!useDPA) return { blocked: false, reason: '' }

    // Jika semua laporan memenuhi akses DPA → aman
    if (useDPA.status_laporan_memenuhi === true) {
      return { blocked: false, reason: '' }
    }

    // Jika ada yang kurang, ambil daftar yg harus diupload
    if (
      useDPA.kurang_upload &&
      Array.isArray(useDPA.kurang_upload) &&
      useDPA.kurang_upload.length > 0
    ) {
      const daftar = useDPA.kurang_upload
        .map((d: CekLaporanDPAItem) => `• ${d.nama_dpa}`)
        .join('\n')

      return {
        blocked: true,
        reason: `Masih ada Laporan DPA yang belum diupload:\n${daftar}`,
      }
    }

    return { blocked: false, reason: '' }
  }

  const isPajakBendaharaIncomplete = () => {
    if (!usePajakBendahara) return { blocked: false, reason: '' }

    // Jika semua laporan memenuhi akses DPA → aman
    if (usePajakBendahara.status_laporan_memenuhi === true) {
      return { blocked: false, reason: '' }
    }

    // Jika ada yang kurang, ambil daftar yg harus diupload
    if (
      usePajakBendahara.kurang_upload &&
      Array.isArray(usePajakBendahara.kurang_upload) &&
      usePajakBendahara.kurang_upload.length > 0
    ) {
      const daftar = usePajakBendahara.kurang_upload
        .map((d: CekLaporanPajakBendaharaItem) => `• ${d.nama_pajak}`)
        .join('\n')

      return {
        blocked: true,
        reason: `Masih ada Laporan Pajak Bendahara yang belum diupload:\n${daftar}`,
      }
    }

    return { blocked: false, reason: '' }
  }

  const isAssetBendaharaIncomplete = () => {
    if (!useAssetBendahara) return { blocked: false, reason: '' }

    // Jika semua laporan memenuhi akses DPA → aman
    if (useAssetBendahara.status_laporan_memenuhi === true) {
      return { blocked: false, reason: '' }
    }

    // Jika ada yang kurang, ambil daftar yg harus diupload
    if (
      useAssetBendahara.kurang_upload &&
      Array.isArray(useAssetBendahara.kurang_upload) &&
      useAssetBendahara.kurang_upload.length > 0
    ) {
      const daftar = useAssetBendahara.kurang_upload
        .map((d: CekLaporanAssetBendaharaItem) => `• ${d.nama_asset}`)
        .join('\n')

      return {
        blocked: true,
        reason: `Masih ada Laporan BMD (Barang Milik Daerah) yang belum diupload:\n${daftar}`,
      }
    }

    return { blocked: false, reason: '' }
  }

  const isSp2bToBUDIncomplete = () => {
    if (!useSp2bToBUD) return { blocked: false, reason: '' }

    // Jika semua laporan memenuhi akses DPA → aman
    if (useSp2bToBUD.status_laporan_memenuhi === true) {
      return { blocked: false, reason: '' }
    }

    // Jika ada yang kurang, ambil daftar yg harus diupload
    if (
      useSp2bToBUD.kurang_upload &&
      Array.isArray(useSp2bToBUD.kurang_upload) &&
      useSp2bToBUD.kurang_upload.length > 0
    ) {
      const daftar = useSp2bToBUD.kurang_upload
        .map((d: CekLaporanSp2bToBUDItem) => `• ${d.nama_sp2b}`)
        .join('\n')

      return {
        blocked: true,
        reason: `Masih ada Laporan SPB (Surat Pengesahan Belanja) yang belum diupload:\n${daftar}`,
      }
    }

    return { blocked: false, reason: '' }
  }

  // 🧠 Deteksi ketika user membuka form add/edit
  useEffect(() => {
    // Berlaku hanya untuk Bendahara
    if (levelAkses !== 'Bendahara') return

    // Jika open = add atau edit
    if (open === 'add' || open === 'edit') {
      const status = isServiceClosed()
      if (status.closed) {
        setShowClosedDialog(true)
        setClosedReason(status.reason)
        setOpen(null) // Jangan tampilkan form
      }

      const statusDPA = isDPAIncomplete()
      if (statusDPA.blocked) {
        setShowClosedDialog(true)
        setClosedReason(statusDPA.reason)
        setOpen(null)
        return
      }

      const statusPajakBendahara = isPajakBendaharaIncomplete()
      if (statusPajakBendahara.blocked) {
        setShowClosedDialog(true)
        setClosedReason(statusPajakBendahara.reason)
        setOpen(null)
        return
      }

      const statusAssetBendahara = isAssetBendaharaIncomplete()
      if (statusAssetBendahara.blocked) {
        setShowClosedDialog(true)
        setClosedReason(statusAssetBendahara.reason)
        setOpen(null)
        return
      }

      const statusSp2bToBUD = isSp2bToBUDIncomplete()
      if (statusSp2bToBUD.blocked) {
        setShowClosedDialog(true)
        setClosedReason(statusSp2bToBUD.reason)
        setOpen(null)
        return
      }

      // 2. CEK STATUS UPLOAD
      const statusUpload = isUploadNotAllowed()
      if (statusUpload.blocked) {
        setShowClosedDialog(true)
        setClosedReason(statusUpload.reason)
        setOpen(null)
        return
      }
    }
  }, [open, levelAkses, dataBatasWaktu, cekUpload])

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
      error: (err) => err.data?.message ?? 'Gagal menghapus data.',
    })
  }

  return (
    <>
      {/* === Dialog Pelayanan Ditutup === */}
      <AlertDialog open={showClosedDialog} onOpenChange={setShowClosedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Pelayanan Ditutup</AlertDialogTitle>
            <AlertDialogDescription>
              {closedReason || 'Maaf, pelayanan sudah ditutup untuk hari ini.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowClosedDialog(false)}>
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* === ADD === */}
      <PermohonanPenerbitanSP2DActionDialog
        key='permohonan-penerbitan-sp2d-add'
        open={open === 'add'}
        edit='add'
        onOpenChange={(val) => setOpen(val ? 'add' : null)}
      />

      {/* === EDIT & DELETE === */}
      {currentRow && (
        <>
          {levelAkses !== 'Bendahara' && (
            <PermohonanPenerbitanPeriksaDialog
              key={`permohonan-penerbitan-sp2d-periksa-${currentRow.id_sp2d}`}
              open={open === 'periksa'}
              onOpenChange={(val) => setOpen(val ? 'periksa' : null)}
              currentRow={currentRow}
            />
          )}

          {/* Hide EDIT if proses === 1 */}
          {currentRow.proses !== '1' && (
            <PermohonanPenerbitanSP2DActionDialog
              key={`permohonan-penerbitan-sp2d-edit-${currentRow.id_sp2d}`}
              open={open === 'edit'}
              edit='edit'
              onOpenChange={(val) => setOpen(val ? 'edit' : null)}
              currentRow={currentRow}
            />
          )}

          {/* Hide DELETE if proses === 1 */}
          {/* {currentRow.proses !== '1' && ( */}
          <ConfirmDialog
            key={`permohonan-penerbitan-sp2d-delete-${currentRow.id_sp2d}`}
            destructive
            open={open === 'delete'}
            onOpenChange={(val) => setOpen(val ? 'delete' : null)}
            handleConfirm={handleDelete}
            className='max-w-md'
            title={`Hapus SP2D ini: ${currentRow.nama_file} ?`}
            desc={
              <>
                Kamu akan menghapus data dengan nama{' '}
                <strong>{currentRow.nama_file}</strong>. <br />
                Tindakan ini tidak dapat dibatalkan.
              </>
            }
            confirmText='Delete'
          />
          {/* )} */}
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
        </>
      )}
    </>
  )
}
