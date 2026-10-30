'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Check,
  X,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileCheck,
  Building2,
  FileSpreadsheet,
  Users,
  Paperclip,
  Save,
  Loader2,
  RotateCcw,
  AlertTriangle,
  ArrowLeft,
  Calculator,
  UserCheck,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import {
  Dialog,
  DialogContentLarge,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { useSkpp } from './skpp-provider'
import { formatRupiah } from '../types'

interface SkppPeriksaDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type VerificationStatus = 'Diterima' | 'Perlu Perbaikan' | 'Ditolak'
type DocumentStatusType = 'valid' | 'tidak_valid' | 'perlu_perbaikan' | 'belum_diperiksa'

interface DocumentItem {
  id: string
  label: string
  sublabel: string
  icon: any
  required: boolean
  url: string | null
  quickSuggestions?: string[]
}

interface FileVerification {
  status: DocumentStatusType
  alasan: string
}

export function SkppPeriksaDialog({
  open,
  onOpenChange,
}: SkppPeriksaDialogProps) {
  const { currentRow, verifikasiSkpp, isBendahara } = useSkpp()

  const API_URL = useMemo(() => {
    return import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api'
  }, [])

  // Active main tab: 'identitas' | 'gaji' | 'tanggungan' | 'pengesahan' | 'berkas'
  const [activeTab, setActiveTab] = useState<string>('identitas')
  const [isSaving, setIsSaving] = useState(false)

  // Per-file verification dictionary: { [docId]: { status, alasan } }
  const [verifikasiBerkas, setVerifikasiBerkas] = useState<Record<string, FileVerification>>({})

  // Active document being inspected in split view (null = viewing normal tabs)
  const [inspectingDocId, setInspectingDocId] = useState<string | null>(null)

  // Active card draft status & reason while in split inspection card
  const [cardStatus, setCardStatus] = useState<'valid' | 'tidak_valid' | 'perlu_perbaikan'>('valid')
  const [cardAlasan, setCardAlasan] = useState<string>('')

  const isPensiun = currentRow?.jenis_skpp === 'pensiun'

  // Build document items list
  const documents: DocumentItem[] = useMemo(() => {
    if (!currentRow) return []

    return [
      {
        id: 'draft_skpp',
        label: 'Draft SKPP Resmi',
        sublabel: 'Dokumen SKPP hasil sistem yang akan diterbitkan',
        icon: FileCheck,
        required: true,
        url: `${API_URL}/skpp/${currentRow.id}/pdf`,
        quickSuggestions: [
          'Rincian gaji belum sesuai dengan SK',
          'Data hutang / potongan perlu diperbaiki',
          'Nama atau NIP penandatangan belum sesuai',
        ],
      },
      {
        id: 'berkas_pengantar_opd',
        label: 'Surat Pengantar OPD',
        sublabel: 'Surat pengantar resmi dari pimpinan OPD pemohon',
        icon: Building2,
        required: true,
        url: currentRow.berkas_urls?.berkas_pengantar_opd || (currentRow.berkas_pengantar_opd ? `${API_URL}/skpp/${currentRow.id}/berkas/berkas_pengantar_opd` : null),
        quickSuggestions: [
          'Belum ditandatangani Kepala OPD',
          'Nomor surat pengantar belum diisi / salah',
          'Stempel basah dinas belum ada',
        ],
      },
      {
        id: 'berkas_sk',
        label: isPensiun ? 'SK Pensiun' : 'SK Mutasi / Pindah',
        sublabel: isPensiun ? 'Surat Keputusan Pensiun BKN/BKD' : 'Surat Keputusan Mutasi Antar Instansi/OPD',
        icon: FileText,
        required: true,
        url: currentRow.berkas_urls?.berkas_sk || (currentRow.berkas_sk ? `${API_URL}/skpp/${currentRow.id}/berkas/berkas_sk` : null),
        quickSuggestions: [
          'Salinan SK buram / terpotong',
          'SK belum dilegalisir basah',
          'TMT pada SK tidak sinkron dengan data pengajuan',
        ],
      },
      {
        id: 'berkas_daftar_gaji',
        label: 'Daftar Gaji Terakhir',
        sublabel: 'Rekapitulasi pembayaran gaji bulan terakhir yang diterima',
        icon: FileSpreadsheet,
        required: true,
        url: currentRow.berkas_urls?.berkas_daftar_gaji || (currentRow.berkas_daftar_gaji ? `${API_URL}/skpp/${currentRow.id}/berkas/berkas_daftar_gaji` : null),
        quickSuggestions: [
          'Bukan daftar gaji bulan terakhir',
          'Rincian potongan / pinjaman belum lengkap',
          'Belum ditandatangani Bendahara Pengeluaran',
        ],
      },
      {
        id: 'berkas_kk',
        label: 'FC Kartu Keluarga (KK)',
        sublabel: 'Kartu Keluarga pegawai yang memuat data tanggungan keluarga',
        icon: Users,
        required: true,
        url: currentRow.berkas_urls?.berkas_kk || (currentRow.berkas_kk ? `${API_URL}/skpp/${currentRow.id}/berkas/berkas_kk` : null),
        quickSuggestions: [
          'Foto / scan Kartu Keluarga buram / tidak terbaca',
          'Jumlah tanggungan tidak sesuai dengan daftar gaji',
          'Data NIK atau nama anak tidak terbaca',
        ],
      },
      {
        id: 'berkas_pendukung',
        label: 'Dokumen Pendukung',
        sublabel: 'Akta kematian, akta nikah/cerai, atau surat keterangan lain (opsional)',
        icon: Paperclip,
        required: false,
        url: currentRow.berkas_urls?.berkas_pendukung || (currentRow.berkas_pendukung ? `${API_URL}/skpp/${currentRow.id}/berkas/berkas_pendukung` : null),
        quickSuggestions: [
          'Surat kematian / akta belum dilampirkan',
          'Dokumen pendukung tidak lengkap',
        ],
      },
    ]
  }, [currentRow, API_URL, isPensiun])

  // Initialize data when dialog opens
  useEffect(() => {
    if (!currentRow || !open) return

    setInspectingDocId(null)
    setActiveTab('identitas')

    const rawChecks = (currentRow.verifikasi_berkas as any) || {}
    const parsed: Record<string, FileVerification> = {}

    documents.forEach((d) => {
      const val = rawChecks[d.id]
      if (typeof val === 'string') {
        parsed[d.id] = {
          status: val as DocumentStatusType,
          alasan: '',
        }
      } else if (typeof val === 'object' && val !== null) {
        parsed[d.id] = {
          status: (val.status as DocumentStatusType) || 'belum_diperiksa',
          alasan: val.alasan || val.catatan || '',
        }
      } else {
        parsed[d.id] = {
          status: 'belum_diperiksa',
          alasan: '',
        }
      }
    })

    setVerifikasiBerkas(parsed)
  }, [currentRow?.id, open])

  // Active document object if in inspection mode
  const currentInspectingDoc = inspectingDocId
    ? documents.find((d) => d.id === inspectingDocId)
    : null

  // Open inspection screen (Large PDF on left, Card on right)
  const handleOpenInspect = (doc: DocumentItem) => {
    if (!doc.url) {
      toast.error('Berkas belum diunggah atau tidak tersedia!')
      return
    }

    setInspectingDocId(doc.id)

    const existing = verifikasiBerkas[doc.id]
    if (existing && existing.status !== 'belum_diperiksa') {
      setCardStatus(existing.status)
      setCardAlasan(existing.alasan || '')
    } else {
      setCardStatus('valid')
      setCardAlasan('')
    }
  }

  // Submit result for the current document
  const handleSubmitCard = () => {
    if (!inspectingDocId || !currentInspectingDoc) return

    if ((cardStatus === 'tidak_valid' || cardStatus === 'perlu_perbaikan') && !cardAlasan.trim()) {
      toast.error(
        cardStatus === 'tidak_valid'
          ? 'Wajib menuliskan alasan penolakan untuk berkas ini!'
          : 'Wajib menuliskan catatan perbaikan untuk berkas ini!'
      )
      return
    }

    // Save this document's individual status and individual reason
    const updatedStatus = cardStatus
    const updatedAlasan = cardStatus === 'valid' ? '' : cardAlasan.trim()

    setVerifikasiBerkas((prev) => ({
      ...prev,
      [inspectingDocId]: {
        status: updatedStatus,
        alasan: updatedAlasan,
      },
    }))

    toast.success(
      updatedStatus === 'valid'
        ? `${currentInspectingDoc.label} ditandai VALID ✓`
        : updatedStatus === 'tidak_valid'
          ? `${currentInspectingDoc.label} ditandai TIDAK VALID ✗`
          : `${currentInspectingDoc.label} ditandai PERLU PERBAIKAN ⚠`
    )

    // Immediately close inspect screen and return to berkas list tab
    setInspectingDocId(null)
  }

  // Cancel inspect screen
  const handleCloseInspect = () => {
    setInspectingDocId(null)
  }

  // Counts of status
  const countValid = Object.values(verifikasiBerkas).filter((v) => v.status === 'valid').length
  const countPerbaikan = Object.values(verifikasiBerkas).filter((v) => v.status === 'perlu_perbaikan').length
  const countTolak = Object.values(verifikasiBerkas).filter((v) => v.status === 'tidak_valid').length
  const totalUploaded = documents.filter((d) => d.url).length

  // Logika otomatis: jika salah satu tidak valid maka skpp tersebut ditolak (murni komputasi tanpa hook)
  const autoStatus: VerificationStatus =
    countTolak > 0 ? 'Ditolak' : countPerbaikan > 0 ? 'Perlu Perbaikan' : 'Diterima'

  // Save final overall verification to database
  const handleSaveVerification = async () => {
    if (!currentRow) return

    const uninspected = documents.filter(
      (d) => d.url && (!verifikasiBerkas[d.id] || verifikasiBerkas[d.id].status === 'belum_diperiksa')
    )
    if (uninspected.length > 0) {
      toast.error(`Ada ${uninspected.length} berkas yang belum diperiksa. Harap periksa semua berkas terlebih dahulu!`)
      return
    }

    try {
      setIsSaving(true)
      const payloadBerkas: Record<string, { status: string; alasan: string }> = {}
      documents.forEach((d) => {
        const v = verifikasiBerkas[d.id]
        payloadBerkas[d.id] = {
          status: v?.status || 'belum_diperiksa',
          alasan: v?.alasan || '',
        }
      })

      await verifikasiSkpp(currentRow.id, {
        status: autoStatus,
        verifikasi_berkas: payloadBerkas,
      })
      onOpenChange(false)
    } catch {
      // error handled in provider
    } finally {
      setIsSaving(false)
    }
  }

  // Jangan render konten jika dialog tidak dibuka atau currentRow belum ada
  if (!open || !currentRow) return null

  // Helper values from currentRow for Tab 2
  const kotorVal = Number(currentRow.jumlah_kotor || 0)
  const potonganVal = Number(currentRow.jumlah_potongan || 0)
  const bersihVal = Number(currentRow.jumlah_bersih || 0)
  const tanggunganList = Array.isArray(currentRow.tanggungan) ? currentRow.tanggungan : []
  const tembusanList = Array.isArray(currentRow.tembusan) ? currentRow.tembusan : []

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onOpenChange(false)}>
      <DialogContentLarge>
        {/* ======================================================== */}
        {/* JIKA SEDANG MEMERIKSA BERKAS: TAMPILAN FULL SPLIT-SCREEN */}
        {/* (PDF UKURAN BESAR DI SISI KIRI + CARD ALASAN DI SISI KANAN) */}
        {/* ======================================================== */}
        {inspectingDocId && currentInspectingDoc ? (
          <div className='flex flex-col h-full overflow-hidden bg-background'>
            {/* TOP BAR MODE PERIKSA BERKAS */}
            <div className='px-4 py-2.5 border-b bg-muted/30 shrink-0 flex items-center justify-between gap-3'>
              <div className='flex items-center gap-3'>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={handleCloseInspect}
                  className='h-8 text-xs flex items-center gap-1.5 text-muted-foreground hover:text-foreground'
                >
                  <ArrowLeft className='h-4 w-4' />
                  <span>Kembali ke Tab Form & Berkas</span>
                </Button>
                <div className='h-4 w-[1px] bg-border' />
                <div className='flex items-center gap-2'>
                  <span className='font-bold text-sm text-foreground'>
                    {currentInspectingDoc.label}
                  </span>
                  {currentInspectingDoc.required ? (
                    <Badge variant='outline' className='text-[10px] px-1.5 py-0 bg-red-50 text-red-600 border-red-200'>
                      Wajib
                    </Badge>
                  ) : (
                    <Badge variant='outline' className='text-[10px] px-1.5 py-0 bg-muted text-muted-foreground'>
                      Opsional
                    </Badge>
                  )}
                </div>
              </div>

              <div className='flex items-center gap-2'>
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={() => {
                    if (currentInspectingDoc.url) {
                      window.open(currentInspectingDoc.url, '_blank')
                    }
                  }}
                  className='h-8 text-xs flex items-center gap-1.5 bg-background text-primary shadow-2xs hover:bg-accent'
                  title='Buka berkas di tab peramban asli'
                >
                  <ExternalLink className='h-3.5 w-3.5' />
                  <span>Buka di Tab Baru</span>
                </Button>
              </div>
            </div>

            {/* SPLIT SCREEN: PDF BESAR (LELUASA) & CARD STATUS + ALASAN */}
            <div className='flex flex-1 overflow-hidden min-h-0'>
              {/* SISI KIRI: PDF BESAR */}
              <div className='flex-1 flex flex-col bg-slate-900/5 relative border-r overflow-hidden p-2'>
                {currentInspectingDoc.url ? (
                  <iframe
                    src={currentInspectingDoc.url}
                    title={currentInspectingDoc.label}
                    className='w-full h-full rounded-md border bg-white shadow-xs'
                  />
                ) : (
                  <div className='flex flex-col items-center justify-center h-full text-center p-8 text-muted-foreground space-y-2'>
                    <FileText className='h-12 w-12 opacity-50' />
                    <p className='text-sm font-semibold'>Berkas Belum Diunggah</p>
                    <p className='text-xs'>Pemohon belum melampirkan berkas ini.</p>
                  </div>
                )}
              </div>

              {/* SISI KANAN: CARD HASIL PEMERIKSAAN & ALASAN BERKAS INI */}
              <div className='w-[400px] shrink-0 flex flex-col bg-background overflow-y-auto border-l p-4.5 space-y-4'>
                <div>
                  <h4 className='text-sm font-bold text-foreground flex items-center gap-1.5'>
                    <FileCheck className='h-4.5 w-4.5 text-primary' />
                    Hasil Pemeriksaan Berkas
                  </h4>
                  <p className='text-[11px] text-muted-foreground mt-0.5'>
                    Tentukan validitas dan berikan alasan khusus untuk <span className='font-semibold text-foreground'>{currentInspectingDoc.label}</span>.
                  </p>
                </div>

                {/* 3 PILIHAN STATUS: VALID, TIDAK VALID, PERLU PERBAIKAN */}
                <div className='space-y-1.5'>
                  <span className='text-xs font-semibold text-muted-foreground block'>
                    Pilih Status Berkas:
                  </span>
                  <div className='grid grid-cols-3 gap-2'>
                    {/* VALID */}
                    <div
                      onClick={() => !isBendahara && setCardStatus('valid')}
                      className={cn(
                        'cursor-pointer rounded-xl p-2.5 border text-center transition-all flex flex-col items-center justify-center gap-1 select-none',
                        cardStatus === 'valid'
                          ? 'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30 shadow-xs'
                          : 'bg-muted/30 hover:bg-muted/60 border-border text-muted-foreground'
                      )}
                    >
                      <div
                        className={cn(
                          'h-7 w-7 rounded-full flex items-center justify-center transition-transform',
                          cardStatus === 'valid'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <Check className='h-4 w-4 stroke-[3]' />
                      </div>
                      <span className='text-xs font-bold'>Valid</span>
                    </div>

                    {/* TIDAK VALID */}
                    <div
                      onClick={() => !isBendahara && setCardStatus('tidak_valid')}
                      className={cn(
                        'cursor-pointer rounded-xl p-2.5 border text-center transition-all flex flex-col items-center justify-center gap-1 select-none',
                        cardStatus === 'tidak_valid'
                          ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/30 shadow-xs'
                          : 'bg-muted/30 hover:bg-muted/60 border-border text-muted-foreground'
                      )}
                    >
                      <div
                        className={cn(
                          'h-7 w-7 rounded-full flex items-center justify-center transition-transform',
                          cardStatus === 'tidak_valid'
                            ? 'bg-rose-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <X className='h-4 w-4 stroke-[3]' />
                      </div>
                      <span className='text-xs font-bold'>Tidak Valid</span>
                    </div>

                    {/* PERLU PERBAIKAN */}
                    <div
                      onClick={() => !isBendahara && setCardStatus('perlu_perbaikan')}
                      className={cn(
                        'cursor-pointer rounded-xl p-2.5 border text-center transition-all flex flex-col items-center justify-center gap-1 select-none',
                        cardStatus === 'perlu_perbaikan'
                          ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30 shadow-xs'
                          : 'bg-muted/30 hover:bg-muted/60 border-border text-muted-foreground'
                      )}
                    >
                      <div
                        className={cn(
                          'h-7 w-7 rounded-full flex items-center justify-center transition-transform',
                          cardStatus === 'perlu_perbaikan'
                            ? 'bg-amber-600 text-white'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        <AlertTriangle className='h-4 w-4' />
                      </div>
                      <span className='text-xs font-bold'>Perbaikan</span>
                    </div>
                  </div>
                </div>

                {/* FORM ALASAN (KHUSUS UNTUK BERKAS INI) */}
                <div className='space-y-2 rounded-xl border p-3 bg-muted/20 flex-1 flex flex-col justify-between'>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs font-semibold text-foreground flex items-center gap-1'>
                        {cardStatus === 'valid'
                          ? 'Keterangan Berkas (Opsional)'
                          : cardStatus === 'tidak_valid'
                            ? 'Alasan Penolakan Berkas Ini'
                            : 'Catatan Perbaikan Berkas Ini'}
                        {cardStatus !== 'valid' && <span className='text-destructive'>*</span>}
                      </span>
                      {cardStatus !== 'valid' && (
                        <span className='text-[10px] text-amber-600 font-medium'>
                          Wajib diisi
                        </span>
                      )}
                    </div>

                    <Textarea
                      rows={4}
                      value={cardAlasan}
                      onChange={(e) => setCardAlasan(e.target.value)}
                      disabled={isBendahara}
                      placeholder={
                        cardStatus === 'valid'
                          ? 'Catatan opsional (misal: Berkas asli dan sah)...'
                          : cardStatus === 'tidak_valid'
                            ? `Jelaskan alasan penolakan berkas ${currentInspectingDoc.label}...`
                            : `Jelaskan kekurangan atau bagian yang harus diperbaiki pada ${currentInspectingDoc.label}...`
                      }
                      className='text-xs resize-none bg-background'
                    />

                    {/* SARAN ALASAN CEPAT */}
                    {currentInspectingDoc.quickSuggestions && currentInspectingDoc.quickSuggestions.length > 0 && !isBendahara && (
                      <div className='space-y-1 pt-1'>
                        <span className='text-[10px] text-muted-foreground block font-medium'>
                          Pilihan Cepat Alasan:
                        </span>
                        <div className='flex flex-wrap gap-1'>
                          {currentInspectingDoc.quickSuggestions.map((sug, sIdx) => (
                            <button
                              key={sIdx}
                              type='button'
                              onClick={() => {
                                setCardAlasan((prev) => (prev ? `${prev}; ${sug}` : sug))
                              }}
                              className='text-[10px] px-2 py-0.5 rounded border bg-background hover:bg-muted text-muted-foreground transition-colors text-left'
                            >
                              + {sug}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* TOMBOL SUBMIT CARD */}
                  <div className='pt-3 border-t flex items-center justify-between gap-2'>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={handleCloseInspect}
                      className='h-8 text-xs text-muted-foreground'
                    >
                      Batal
                    </Button>

                    {!isBendahara && (
                      <Button
                        type='button'
                        size='sm'
                        onClick={handleSubmitCard}
                        className={cn(
                          'h-8 text-xs font-semibold text-white shadow-2xs flex items-center gap-1.5',
                          cardStatus === 'valid'
                            ? 'bg-emerald-600 hover:bg-emerald-700'
                            : cardStatus === 'tidak_valid'
                              ? 'bg-rose-600 hover:bg-rose-700'
                              : 'bg-amber-600 hover:bg-amber-700'
                        )}
                      >
                        <Check className='h-3.5 w-3.5' />
                        <span>Simpan & Selesai (Submit)</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* TAMPILAN NORMAL: TAB PENGISIAN SKPP (READ-ONLY) + TAB 5 PERIKSA BERKAS */
          /* ======================================================== */
          <div className='flex flex-col h-full overflow-hidden'>
            {/* HEADER MODAL BESAR */}
            <DialogHeader className='pb-3 border-b shrink-0'>
              <div className='flex items-center justify-between gap-4 flex-wrap'>
                <div>
                  <DialogTitle className='flex items-center gap-2 text-xl font-bold text-primary'>
                    <FileCheck className='h-5.5 w-5.5' />
                    Pemeriksaan & Verifikasi Dokumen SKPP
                  </DialogTitle>
                  <DialogDescription className='text-xs text-muted-foreground mt-0.5'>
                    Tinjau seluruh data isian permohonan SKPP (read-only) dan lakukan pemeriksaan dokumen lampiran satu per satu pada tab terakhir.
                  </DialogDescription>
                </div>

                <Badge
                  className={cn(
                    'text-xs font-semibold px-2.5 py-1',
                    countTolak > 0
                      ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border-rose-300'
                      : countPerbaikan > 0
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-300'
                  )}
                >
                  Status Otomatis:{' '}
                  {countTolak > 0
                    ? 'Ditolak (Ada Berkas Tidak Valid)'
                    : countPerbaikan > 0
                      ? 'Perlu Perbaikan'
                      : 'Valid (Disetujui)'}
                </Badge>
              </div>

              {/* CHIP RINGKASAN PEGAWAI */}
              <div className='mt-2.5 flex items-center gap-2 flex-wrap text-xs bg-muted/30 p-2.5 rounded-lg border'>
                <div className='flex items-center gap-1.5 font-semibold text-foreground'>
                  <span>{currentRow.nama}</span>
                  <span className='text-muted-foreground font-mono text-[11px]'>({currentRow.nip})</span>
                </div>
                <span className='text-muted-foreground'>•</span>
                <span className='text-muted-foreground truncate max-w-[240px]' title={currentRow.unit_kerja}>
                  {currentRow.unit_kerja}
                </span>
                <span className='text-muted-foreground'>•</span>
                <Badge variant='outline' className='text-[10px] px-1.5 py-0'>
                  SKPP {isPensiun ? 'Pensiun' : 'Mutasi'}
                </Badge>
                <span className='text-muted-foreground'>•</span>
                <span className='text-muted-foreground'>Gaji Bersih:</span>
                <span className='font-bold text-emerald-600 dark:text-emerald-400'>
                  {formatRupiah(currentRow.jumlah_bersih)}
                </span>
              </div>
            </DialogHeader>

            {/* TAB CONTAINER MENYERUPAI FORM PENGISIAN SKPP */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='w-full flex-1 flex flex-col min-h-0 pt-2'
            >
              <TabsList className='grid grid-cols-5 w-full shrink-0 h-10'>
                <TabsTrigger value='identitas' className='text-xs sm:text-sm flex items-center gap-1.5'>
                  <UserCheck className='h-4 w-4' />
                  <span className='truncate'>1. Identitas & SK</span>
                </TabsTrigger>
                <TabsTrigger value='gaji' className='text-xs sm:text-sm flex items-center gap-1.5'>
                  <Calculator className='h-4 w-4' />
                  <span className='truncate'>2. Gaji & Potongan</span>
                </TabsTrigger>
                <TabsTrigger value='tanggungan' className='text-xs sm:text-sm flex items-center gap-1.5'>
                  <Users className='h-4 w-4' />
                  <span className='truncate'>3. Tanggungan</span>
                </TabsTrigger>
                <TabsTrigger value='pengesahan' className='text-xs sm:text-sm flex items-center gap-1.5'>
                  <FileText className='h-4 w-4' />
                  <span className='truncate'>4. Pengesahan</span>
                </TabsTrigger>
                <TabsTrigger
                  value='berkas'
                  className={cn(
                    'text-xs sm:text-sm flex items-center gap-1.5 font-bold',
                    activeTab === 'berkas' ? 'text-primary' : ''
                  )}
                >
                  <FileCheck className='h-4 w-4' />
                  <span className='truncate'>5. Periksa Berkas</span>
                  <Badge variant='secondary' className='text-[10px] px-1.5 py-0 ml-1'>
                    {countValid + countPerbaikan + countTolak}/{totalUploaded}
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* ======================================================== */}
              {/* TAB 1: IDENTITAS & SK (READ-ONLY) */}
              {/* ======================================================== */}
              <TabsContent value='identitas' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold text-muted-foreground'>Jenis SKPP</Label>
                    <div className='h-10 px-3 border rounded-md bg-muted/30 flex items-center text-xs font-semibold text-foreground'>
                      {isPensiun ? 'Pensiun' : 'Pindah / Mutasi'}
                    </div>
                  </div>

                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold text-muted-foreground'>Nomor Surat SKPP</Label>
                    <div className='h-10 px-3 border rounded-md bg-muted/30 flex items-center text-xs font-mono font-semibold text-foreground'>
                      {currentRow.nomor_surat || 'Draft / Belum Diterbitkan'}
                    </div>
                  </div>

                  <div className='space-y-1.5'>
                    <Label className='text-xs font-semibold text-muted-foreground'>Status Pengajuan</Label>
                    <div className='h-10 px-3 border rounded-md bg-muted/30 flex items-center text-xs font-semibold text-foreground'>
                      {currentRow.status}
                    </div>
                  </div>
                </div>

                {/* Data Pegawai */}
                <div className='rounded-lg border p-4 bg-muted/15 space-y-3.5'>
                  <h4 className='text-sm font-semibold text-primary flex items-center gap-1.5'>
                    <UserCheck className='h-4 w-4' />
                    Data Pegawai yang Diberhentikan Pembayarannya
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Nama Pegawai (Lengkap Gelar)</Label>
                      <Input readOnly value={currentRow.nama || ''} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>NIP Pegawai</Label>
                      <Input readOnly value={currentRow.nip || ''} className='bg-muted/30 font-mono text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Tanggal Lahir Pegawai</Label>
                      <Input readOnly value={currentRow.tgl_lahir || '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Pangkat / Golongan</Label>
                      <Input readOnly value={currentRow.golongan || '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5 md:col-span-2'>
                      <Label className='text-xs font-semibold text-muted-foreground flex items-center gap-1.5'>
                        <Building2 className='h-3.5 w-3.5 text-primary' />
                        Unit Kerja Asal (OPD)
                      </Label>
                      <Input readOnly value={currentRow.unit_kerja || '-'} className='bg-muted/30 font-medium text-foreground cursor-default' />
                    </div>
                  </div>
                </div>

                {/* Dasar SK */}
                <div className='rounded-lg border p-4 bg-muted/15 space-y-3.5'>
                  <h4 className='text-sm font-semibold text-primary flex items-center gap-1.5'>
                    <FileText className='h-4 w-4' />
                    Dasar Surat Keputusan (SK)
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Nomor SK</Label>
                      <Input readOnly value={currentRow.nomor_sk || '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Tanggal SK</Label>
                      <Input readOnly value={currentRow.tgl_sk || '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Terhitung Mulai Tanggal (TMT)</Label>
                      <Input readOnly value={currentRow.tmt_sk || '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5 md:col-span-2'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Surat Keputusan Dari</Label>
                      <Input readOnly value={currentRow.sk_dari || '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>

                    {isPensiun ? (
                      <>
                        <div className='space-y-1.5 md:col-span-2'>
                          <Label className='text-xs font-semibold text-muted-foreground'>Alasan Pemberhentian / Pensiun</Label>
                          <Input readOnly value={currentRow.alasan_pensiun || 'diberhentikan dengan hormat sebagai Pegawai Negeri Sipil'} className='bg-muted/30 text-foreground cursor-default' />
                        </div>
                        <div className='space-y-1.5'>
                          <Label className='text-xs font-semibold text-muted-foreground'>Pensiun Pokok Sebulan (Rp)</Label>
                          <Input readOnly value={formatRupiah(currentRow.pensiun_pokok)} className='bg-muted/30 font-bold text-foreground cursor-default' />
                        </div>
                      </>
                    ) : (
                      <div className='space-y-1.5 md:col-span-2'>
                        <Label className='text-xs font-semibold text-muted-foreground'>Dimutasikan Ke (Instansi Tujuan)</Label>
                        <Input readOnly value={currentRow.mutasi_ke || '-'} className='bg-muted/30 font-medium text-foreground cursor-default' />
                      </div>
                    )}

                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Gaji Dibayarkan Sampai Akhir Bulan</Label>
                      <Input readOnly value={currentRow.gaji_terakhir_bulan || '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ======================================================== */}
              {/* TAB 2: GAJI & POTONGAN (READ-ONLY) */}
              {/* ======================================================== */}
              <TabsContent value='gaji' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
                {/* Summary Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2'>
                  <Card className='border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30'>
                    <CardContent className='p-3'>
                      <span className='text-xs text-muted-foreground block font-medium'>Jumlah Kotor (A)</span>
                      <span className='text-lg font-bold text-blue-700 dark:text-blue-400'>
                        {formatRupiah(kotorVal)}
                      </span>
                    </CardContent>
                  </Card>

                  <Card className='border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/30'>
                    <CardContent className='p-3'>
                      <span className='text-xs text-muted-foreground block font-medium'>Jumlah Potongan (B)</span>
                      <span className='text-lg font-bold text-amber-700 dark:text-amber-400'>
                        {formatRupiah(potonganVal)}
                      </span>
                    </CardContent>
                  </Card>

                  <Card className='border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30'>
                    <CardContent className='p-3'>
                      <span className='text-xs text-muted-foreground block font-medium'>Jumlah Bersih (A - B)</span>
                      <span className='text-lg font-bold text-emerald-700 dark:text-emerald-400'>
                        {formatRupiah(bersihVal)}
                      </span>
                    </CardContent>
                  </Card>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                  {/* A. PENERIMAAN */}
                  <div className='rounded-lg border p-4 space-y-3 bg-muted/10'>
                    <div className='flex items-center justify-between border-b pb-2.5'>
                      <h4 className='text-xs font-bold uppercase text-primary tracking-wide'>A. Penerimaan</h4>
                      <span className='text-xs font-semibold text-blue-600 dark:text-blue-400'>
                        Total: {formatRupiah(kotorVal)}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-2.5 text-xs'>
                      <div className='space-y-1 col-span-2'>
                        <Label className='text-[11px] text-muted-foreground'>Gaji Pokok</Label>
                        <Input readOnly value={formatRupiah(currentRow.gaji_pokok)} className='h-8 text-xs bg-muted/30 font-semibold text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. Istri / Suami</Label>
                        <Input readOnly value={formatRupiah(currentRow.tunj_istri_suami)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. Anak</Label>
                        <Input readOnly value={formatRupiah(currentRow.tunj_anak)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. Struktural</Label>
                        <Input readOnly value={formatRupiah(currentRow.tunj_struktural)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. Fungsional</Label>
                        <Input readOnly value={formatRupiah(currentRow.tunj_fungsional)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. Beras</Label>
                        <Input readOnly value={formatRupiah(currentRow.tunj_beras)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. Umum</Label>
                        <Input readOnly value={formatRupiah(currentRow.tunj_umum)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. Perb. Penghasilan</Label>
                        <Input readOnly value={formatRupiah(currentRow.tunj_perb_penghasilan)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. BPJS Kesehatan</Label>
                        <Input readOnly value={formatRupiah(currentRow.tunj_kesehatan)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Tunj. JKK & JKM</Label>
                        <Input readOnly value={formatRupiah((Number(currentRow.tunj_jkk) || 0) + (Number(currentRow.tunj_jkm) || 0))} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Pembulatan</Label>
                        <Input readOnly value={formatRupiah(currentRow.pembulatan)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                    </div>
                  </div>

                  {/* B. POTONGAN */}
                  <div className='rounded-lg border p-4 space-y-3 bg-muted/10'>
                    <div className='flex items-center justify-between border-b pb-2.5'>
                      <h4 className='text-xs font-bold uppercase text-primary tracking-wide'>B. Potongan</h4>
                      <span className='text-xs font-semibold text-amber-600 dark:text-amber-400'>
                        Total: {formatRupiah(potonganVal)}
                      </span>
                    </div>

                    <div className='grid grid-cols-2 gap-2.5 text-xs'>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>IWP 1%</Label>
                        <Input readOnly value={formatRupiah(currentRow.pot_iwp_1)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>IWP 8%</Label>
                        <Input readOnly value={formatRupiah(currentRow.pot_iwp_8)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Askes / BPJS</Label>
                        <Input readOnly value={formatRupiah(currentRow.pot_askes)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Pajak PPh 21</Label>
                        <Input readOnly value={formatRupiah(currentRow.pot_pajak)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Taperum</Label>
                        <Input readOnly value={formatRupiah(currentRow.pot_taperum)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Iuran Korpri</Label>
                        <Input readOnly value={formatRupiah(currentRow.iuran_korpri)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Sewa Rumah</Label>
                        <Input readOnly value={formatRupiah(currentRow.pot_sewa_rumah)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[11px] text-muted-foreground'>Potongan Hutang Lain</Label>
                        <Input readOnly value={formatRupiah(currentRow.pot_hutang)} className='h-8 text-xs bg-muted/30 text-foreground cursor-default' />
                      </div>
                    </div>
                  </div>
                </div>

                {/* C. HUTANG */}
                <div className='rounded-lg border p-4 bg-muted/15 space-y-3'>
                  <h4 className='text-sm font-semibold text-primary flex items-center gap-1.5'>
                    <Calculator className='h-4 w-4' />
                    C. Data Hutang / Pinjaman Pegawai
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Jumlah Hutang (Rp)</Label>
                      <Input readOnly value={formatRupiah((currentRow as any).jumlah_hutang ?? currentRow.hutang?.jumlah_hutang ?? 0)} className='bg-muted/30 font-bold text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Keterangan Hutang</Label>
                      <Input readOnly value={(currentRow as any).keterangan_hutang ?? currentRow.hutang?.keterangan ?? '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ======================================================== */}
              {/* TAB 3: TANGGUNGAN KELUARGA (READ-ONLY) */}
              {/* ======================================================== */}
              <TabsContent value='tanggungan' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
                <div className='rounded-lg border p-4 space-y-3.5 bg-muted/10'>
                  <div className='flex items-center justify-between'>
                    <h4 className='text-sm font-semibold text-primary flex items-center gap-1.5'>
                      <Users className='h-4 w-4' />
                      Daftar Tanggungan Keluarga ({tanggunganList.length} Orang)
                    </h4>
                  </div>

                  {tanggunganList.length === 0 ? (
                    <div className='text-center py-8 text-muted-foreground text-xs border rounded-md border-dashed'>
                      Tidak ada data tanggungan keluarga yang dicantumkan.
                    </div>
                  ) : (
                    <div className='border rounded-md overflow-hidden bg-background'>
                      <table className='w-full text-xs text-left'>
                        <thead className='bg-muted/50 border-b text-muted-foreground font-semibold'>
                          <tr>
                            <th className='p-2.5 w-12 text-center'>No</th>
                            <th className='p-2.5'>Nama Anggota Keluarga</th>
                            <th className='p-2.5 w-36'>Tanggal Lahir</th>
                            <th className='p-2.5'>Hubungan / Keterangan</th>
                          </tr>
                        </thead>
                        <tbody className='divide-y'>
                          {tanggunganList.map((t: any, idx: number) => (
                            <tr key={idx} className='hover:bg-muted/20'>
                              <td className='p-2.5 text-center font-mono'>{idx + 1}</td>
                              <td className='p-2.5 font-semibold text-foreground'>{t.nama || '-'}</td>
                              <td className='p-2.5 font-mono'>{t.tgl_lahir || '-'}</td>
                              <td className='p-2.5 text-muted-foreground'>{t.keterangan || '-'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* ======================================================== */}
              {/* TAB 4: PENGESAHAN & TEMBUSAN (READ-ONLY) */}
              {/* ======================================================== */}
              <TabsContent value='pengesahan' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
                <div className='rounded-lg border p-4 space-y-3.5 bg-muted/15'>
                  <h4 className='text-sm font-semibold text-primary flex items-center gap-1.5'>
                    <UserCheck className='h-4 w-4' />
                    Data Pejabat Penandatangan SKPP
                  </h4>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Tempat Penetapan</Label>
                      <Input readOnly value={currentRow.tempat_penetapan || 'Sei Rampah'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Tanggal Penetapan</Label>
                      <Input readOnly value={currentRow.tgl_penetapan || '-'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5 md:col-span-2'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Jabatan Penandatangan</Label>
                      <Input readOnly value={currentRow.jabatan_penandatangan || 'An. KEPALA BADAN PENGELOLAAN KEUANGAN DAN ASET DAERAH KABUPATEN SERDANG BEDAGAI KABID PERBENDAHARAAN, AKUNTANSI DAN PELAPORAN'} className='bg-muted/30 text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>Nama Pejabat</Label>
                      <Input readOnly value={currentRow.nama_penandatangan || 'MUHAMMAD ALI LUBIS, SE'} className='bg-muted/30 font-bold text-foreground cursor-default' />
                    </div>
                    <div className='space-y-1.5'>
                      <Label className='text-xs font-semibold text-muted-foreground'>NIP Pejabat</Label>
                      <Input readOnly value={currentRow.nip_penandatangan || '197801172008031002'} className='bg-muted/30 font-mono text-foreground cursor-default' />
                    </div>
                  </div>
                </div>

                {/* Tembusan SKPP */}
                <div className='rounded-lg border p-4 space-y-3 bg-muted/10'>
                  <h4 className='text-sm font-semibold text-primary'>Tembusan Surat SKPP</h4>
                  <div className='space-y-2'>
                    {tembusanList.map((item: string, idx: number) => (
                      <div key={idx} className='flex items-center gap-2 text-xs'>
                        <span className='font-mono w-6 text-muted-foreground'>{idx + 1}.</span>
                        <div className='p-2 rounded border bg-background flex-1 text-foreground'>{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* ======================================================== */}
              {/* TAB 5: LAMPIRAN BERKAS & VERIFIKASI (YANG TERAKHIR DIPERIKSA 1 PER 1) */}
              {/* ======================================================== */}
              <TabsContent value='berkas' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
                {/* STATS BAR */}
                <div className='flex items-center justify-between bg-muted/30 px-3.5 py-2.5 rounded-lg border text-xs'>
                  <span className='font-bold text-foreground flex items-center gap-1.5'>
                    <FileCheck className='h-4 w-4 text-primary' />
                    Daftar Berkas yang Harus Diperiksa:
                  </span>
                  <div className='flex items-center gap-2.5 text-[11px] font-semibold'>
                    <span className='flex items-center gap-1 text-emerald-600'>
                      <CheckCircle2 className='h-3.5 w-3.5' /> {countValid} Valid
                    </span>
                    <span className='text-muted-foreground'>•</span>
                    <span className='flex items-center gap-1 text-amber-600'>
                      <AlertCircle className='h-3.5 w-3.5' /> {countPerbaikan} Perlu Perbaikan
                    </span>
                    <span className='text-muted-foreground'>•</span>
                    <span className='flex items-center gap-1 text-rose-600'>
                      <XCircle className='h-3.5 w-3.5' /> {countTolak} Tidak Valid
                    </span>
                  </div>
                </div>

                {/* DAFTAR DOKUMEN 1 PER 1 */}
                <div className='space-y-3'>
                  {documents.map((doc) => {
                    const Icon = doc.icon
                    const hasFile = Boolean(doc.url)
                    const v = verifikasiBerkas[doc.id] || { status: 'belum_diperiksa', alasan: '' }

                    return (
                      <div
                        key={doc.id}
                        className={cn(
                          'rounded-xl border p-3.5 flex flex-col gap-2.5 transition-all',
                          v.status === 'valid'
                            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800/40'
                            : v.status === 'tidak_valid'
                              ? 'bg-rose-50/40 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800/40'
                              : v.status === 'perlu_perbaikan'
                                ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800/40'
                                : 'bg-background hover:bg-muted/10 border-border'
                        )}
                      >
                        <div className='flex items-center justify-between gap-3 flex-wrap'>
                          {/* KIRI: IKON + NAMA BERKAS */}
                          <div className='flex items-center gap-3 min-w-[220px] flex-1'>
                            <div
                              className={cn(
                                'h-9 w-9 rounded-lg flex items-center justify-center shrink-0 border',
                                v.status === 'valid'
                                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-300'
                                  : v.status === 'tidak_valid'
                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300 border-rose-300'
                                    : v.status === 'perlu_perbaikan'
                                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300 border-amber-300'
                                      : 'bg-muted text-muted-foreground border-border'
                              )}
                            >
                              <Icon className='h-4.5 w-4.5' />
                            </div>

                            <div className='flex flex-col'>
                              <div className='flex items-center gap-1.5'>
                                <span className='text-sm font-bold text-foreground'>
                                  {doc.label}
                                </span>
                                {doc.required ? (
                                  <Badge variant='outline' className='text-[9px] px-1.5 py-0 bg-red-50 text-red-600 border-red-200'>
                                    Wajib
                                  </Badge>
                                ) : (
                                  <Badge variant='outline' className='text-[9px] px-1.5 py-0 bg-muted text-muted-foreground'>
                                    Opsional
                                  </Badge>
                                )}
                              </div>
                              <span className='text-[11px] text-muted-foreground leading-tight'>
                                {doc.sublabel}
                              </span>
                            </div>
                          </div>

                          {/* TENGAH & KANAN: STATUS & TOMBOL PERIKSA */}
                          <div className='flex items-center gap-2.5 shrink-0 ml-auto'>
                            {!hasFile ? (
                              <Badge variant='outline' className='text-xs px-2.5 py-1 bg-muted/60 text-muted-foreground border-dashed'>
                                Belum Diunggah
                              </Badge>
                            ) : v.status === 'belum_diperiksa' ? (
                              /* BELUM DIPERIKSA: TOMBOL PERIKSA */
                              <Button
                                type='button'
                                size='sm'
                                onClick={() => handleOpenInspect(doc)}
                                className='h-8 text-xs font-semibold flex items-center gap-1.5 bg-primary text-primary-foreground shadow-xs hover:bg-primary/90'
                              >
                                <ExternalLink className='h-3.5 w-3.5' />
                                <span>Periksa</span>
                              </Button>
                            ) : v.status === 'valid' ? (
                              /* KETIKA VALID: TANDA CEKLIS + TOMBOL PERIKSA ULANG BERKAS */
                              <div className='flex items-center gap-2'>
                                <Badge className='bg-emerald-600 hover:bg-emerald-600 text-white text-xs px-2.5 py-1 flex items-center gap-1 shadow-2xs font-semibold'>
                                  <Check className='h-3.5 w-3.5 stroke-[3]' />
                                  <span>Valid</span>
                                </Badge>

                                <Button
                                  type='button'
                                  size='sm'
                                  variant='outline'
                                  onClick={() => handleOpenInspect(doc)}
                                  className='h-8 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 bg-background shadow-2xs'
                                  title='Buka kembali dokumen dan ubah hasil pemeriksaan'
                                >
                                  <RotateCcw className='h-3 w-3' />
                                  <span>Periksa Ulang Berkas</span>
                                </Button>
                              </div>
                            ) : (
                              /* KETIKA TIDAK VALID / PERLU PERBAIKAN: TANDA X / WARNING + TOMBOL PERIKSA ULANG BERKAS */
                              <div className='flex items-center gap-2'>
                                {v.status === 'tidak_valid' ? (
                                  <Badge className='bg-rose-600 hover:bg-rose-600 text-white text-xs px-2.5 py-1 flex items-center gap-1 shadow-2xs font-semibold'>
                                    <X className='h-3.5 w-3.5 stroke-[3]' />
                                    <span>Tidak Valid</span>
                                  </Badge>
                                ) : (
                                  <Badge className='bg-amber-600 hover:bg-amber-600 text-white text-xs px-2.5 py-1 flex items-center gap-1 shadow-2xs font-semibold'>
                                    <AlertTriangle className='h-3.5 w-3.5' />
                                    <span>Perlu Perbaikan</span>
                                  </Badge>
                                )}

                                <Button
                                  type='button'
                                  size='sm'
                                  variant='outline'
                                  onClick={() => handleOpenInspect(doc)}
                                  className='h-8 text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 bg-background shadow-2xs'
                                  title='Buka kembali dokumen dan ubah hasil pemeriksaan'
                                >
                                  <RotateCcw className='h-3 w-3' />
                                  <span>Periksa Ulang Berkas</span>
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* ALASAN PENOLAKAN / CATATAN KHUSUS UNTUK BERKAS INI */}
                        {v.alasan && (v.status === 'tidak_valid' || v.status === 'perlu_perbaikan') && (
                          <div
                            className={cn(
                              'text-xs px-3 py-2 rounded-lg border flex items-start gap-2',
                              v.status === 'tidak_valid'
                                ? 'bg-rose-100/60 dark:bg-rose-950/40 border-rose-300 dark:border-rose-900 text-rose-900 dark:text-rose-200'
                                : 'bg-amber-100/60 dark:bg-amber-950/40 border-amber-300 dark:border-amber-900 text-amber-900 dark:text-amber-200'
                            )}
                          >
                            <span className='font-bold shrink-0'>
                              {v.status === 'tidak_valid' ? 'Alasan Penolakan:' : 'Catatan Perbaikan:'}
                            </span>
                            <span className='leading-relaxed'>{v.alasan}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* TOMBOL SIMPAN HASIL PEMERIKSAAN PADA TAB BERKAS */}
                <div className='mt-6 pt-4 border-t flex items-center justify-between gap-2'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => onOpenChange(false)}
                    className='h-9 text-xs'
                  >
                    Tutup
                  </Button>

                  {!isBendahara && (
                    <Button
                      type='button'
                      size='sm'
                      disabled={isSaving}
                      onClick={handleSaveVerification}
                      className={cn(
                        'h-9 text-xs font-semibold flex items-center gap-1.5 text-white shadow-xs',
                        countTolak > 0
                          ? 'bg-rose-600 hover:bg-rose-700'
                          : countPerbaikan > 0
                            ? 'bg-amber-600 hover:bg-amber-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                      )}
                    >
                      {isSaving ? (
                        <Loader2 className='h-4 w-4 animate-spin' />
                      ) : (
                        <Save className='h-4 w-4' />
                      )}
                      <span>
                        Simpan Pemeriksaan (
                        {countTolak > 0
                          ? 'Ditolak'
                          : countPerbaikan > 0
                            ? 'Perlu Perbaikan'
                            : 'Diterima / Valid'}
                        )
                      </span>
                    </Button>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </DialogContentLarge>
    </Dialog>
  )
}
