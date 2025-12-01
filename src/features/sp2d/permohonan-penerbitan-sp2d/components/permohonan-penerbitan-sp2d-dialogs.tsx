import { useState, useEffect } from 'react'
import {
  useCekUploadFungsional,
  useDeletePermohonanSP2D,
  useGetBatasWaktu,
} from '@/api'
import { toast } from 'sonner'
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

    // Jika tidak wajib upload → tidak blokir
    if (!cekUpload.wajib) {
      return { blocked: false, reason: '' }
    }

    // Cek bulan-bulan yang belum upload
    if (cekUpload.bulan_kurang && cekUpload.bulan_kurang.length > 0) {
      const listBulan = cekUpload.bulan_kurang
        .map((b) => `Bulan ${b}`)
        .join(', ')

      return {
        blocked: true,
        reason: `Masih ada laporan fungsional yang belum diupload pada: ${listBulan}.`,
      }
    }

    // Jika wajib dan belum upload bulan ini
    if (!cekUpload.pengeluaran) {
      return {
        blocked: true,
        reason: 'Anda belum upload laporan fungsional (Pengeluaran) bulan ini.',
      }
    }

    // Jika status 1 → Penerimaan juga wajib
    if (user?.skpd.status_penerimaan == '1' && !cekUpload.penerimaan) {
      return {
        blocked: true,
        reason: 'Anda belum upload laporan fungsional (Penerimaan) bulan ini.',
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
        </>
      )}
    </>
  )
}
