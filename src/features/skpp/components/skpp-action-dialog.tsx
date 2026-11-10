import { useEffect, useState, useMemo, useRef } from 'react'
import {
  Dialog,
  DialogContentLarge,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import {
  Plus,
  Trash2,
  Calculator,
  Users,
  FileText,
  UserCheck,
  Building2,
  Check,
  ChevronsUpDown,
  Lock,
  RefreshCw,
  UploadCloud,
  Eye,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'
import { useGetRefSKPD, type MasterSkpd } from '@/api'
import { useSkpp } from './skpp-provider'
import { RupiahInput } from './rupiah-input'
import type { SkppData, TanggunganKeluarga } from '../types'

// Helper untuk generate daftar tembusan SKPP yang dinamis sesuai OPD dan instansi tujuan
export const generateDefaultTembusan = (
  unitKerja?: string,
  mutasiKe?: string,
  jenis: 'pensiun' | 'mutasi' = 'mutasi'
): string[] => {
  const cleanOpd = (unitKerja || '').trim()
  const cleanMutasi = (mutasiKe || '').trim()

  const opdLine = cleanOpd
    ? cleanOpd.toLowerCase().includes('serdang bedagai')
      ? `${cleanOpd};`
      : `${cleanOpd} Kabupaten Serdang Bedagai;`
    : 'SKPD Asal / Unit Kerja Terkait Kabupaten Serdang Bedagai;'

  if (jenis === 'pensiun') {
    const opdName = cleanOpd
      ? cleanOpd.toLowerCase().includes('serdang bedagai')
        ? cleanOpd
        : `${cleanOpd} Kabupaten Serdang Bedagai.`
      : 'SKPD Asal Kabupaten Serdang Bedagai.'

    return [
      'Asli (Kepada yang bersangkutan untuk dilampirkan pada permintaan pensiun pertamanya);',
      'PT. TASPEN (Persero) Cabang Utama Medan;',
      'Kepala BPKAD Kabupaten Serdang Bedagai;',
      `Bendahara ${opdName}`,
    ]
  }

  const mutasiLine = cleanMutasi
    ? `${cleanMutasi}.`
    : 'Pemerintah Daerah / Instansi Penerima.'

  return [
    'Asli (Kepada yang bersangkutan untuk dilampirkan pada Permintaan Gaji Pertamanya);',
    'Badan Pengelola Keuangan dan Pendapatan Daerah Kabupaten Serdang Bedagai;',
    opdLine,
    mutasiLine,
  ]
}

interface FileUploadCardProps {
  label?: string
  title?: string
  required?: boolean
  description: string
  file: File | null
  existingUrl?: string | null
  onFileSelect: (file: File | null) => void
}

function FileUploadCard({
  label,
  title,
  required,
  description,
  file,
  existingUrl,
  onFileSelect,
}: FileUploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const displayLabel = label || title || 'Upload Berkas'

  return (
    <div className='rounded-lg border p-3.5 bg-card flex flex-col gap-2.5 transition-all hover:border-primary/40 shadow-xs'>
      <div className='flex items-start justify-between gap-2'>
        <div>
          <div className='flex items-center gap-1.5'>
            <span className='text-xs font-bold text-foreground'>{displayLabel}</span>
            {required ? (
              <span className='text-destructive text-xs font-bold'>* (Wajib)</span>
            ) : (
              <span className='text-muted-foreground text-[10px]'>(Opsional)</span>
            )}
          </div>
          <p className='text-[11px] text-muted-foreground mt-0.5 leading-snug'>{description}</p>
        </div>
        {existingUrl && !file && (
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-7 text-xs flex items-center gap-1 text-primary shrink-0'
            onClick={() => window.open(existingUrl, '_blank')}
          >
            <Eye className='h-3.5 w-3.5' />
            Lihat Berkas
          </Button>
        )}
      </div>

      <input
        ref={inputRef}
        type='file'
        accept='.pdf,.jpg,.jpeg,.png'
        className='hidden'
        onChange={(e) => {
          const selected = e.target.files?.[0] || null
          onFileSelect(selected)
        }}
      />

      {file ? (
        <div className='flex items-center justify-between bg-primary/10 border border-primary/30 p-2.5 rounded-md text-xs'>
          <div className='flex items-center gap-2 truncate'>
            <FileText className='h-4 w-4 text-primary shrink-0' />
            <span className='truncate font-medium'>{file.name}</span>
            <span className='text-[10px] text-muted-foreground'>
              ({(file.size / 1024 / 1024).toFixed(2)} MB)
            </span>
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            onClick={() => onFileSelect(null)}
            className='h-6 px-2 text-destructive hover:bg-destructive/10'
          >
            Batal
          </Button>
        </div>
      ) : existingUrl ? (
        <div className='flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 p-2.5 rounded-md text-xs'>
          <span className='text-emerald-700 dark:text-emerald-300 font-medium flex items-center gap-1.5'>
            <Check className='h-3.5 w-3.5 text-emerald-600' /> Berkas tersimpan di server
          </span>
          <Button
            type='button'
            variant='outline'
            size='sm'
            className='h-6 text-[11px]'
            onClick={() => inputRef.current?.click()}
          >
            Ganti File
          </Button>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className='border-2 border-dashed rounded-md p-3 text-center cursor-pointer hover:bg-muted/40 transition-colors flex flex-col items-center justify-center gap-1'
        >
          <UploadCloud className='h-5 w-5 text-muted-foreground' />
          <span className='text-xs font-medium text-primary'>Pilih atau Unggah File</span>
          <span className='text-[10px] text-muted-foreground'>Format PDF, JPG, PNG (Maks 10MB)</span>
        </div>
      )}
    </div>
  )
}

export function SkppActionDialog() {
  const { open, setOpen, currentRow, addSkpp, updateSkpp, isBendahara } = useSkpp()
  const isEdit = open === 'edit'
  const isOpen = open === 'create' || open === 'edit'

  const [opdOpen, setOpdOpen] = useState(false)

  // Ambil data SKPD aktif dari localStorage (untuk Bendahara)
  const userSkpd = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user_skpd') || '{}') as MasterSkpd
    } catch {
      return {} as MasterSkpd
    }
  }, [])

  // Ambil daftar referensi OPD dari tabel REF_OPD
  const { data: dataSKPD, isLoading: isLoadingSKPD } = useGetRefSKPD({
    page: 1,
    perPage: 200,
    hidden: '0',
  })

  const opdItems = useMemo(() => {
    if (!dataSKPD?.data) return []
    return [...dataSKPD.data].sort((a, b) =>
      (a.nm_opd || '').localeCompare(b.nm_opd || '')
    )
  }, [dataSKPD])

  const [files, setFiles] = useState<{
    berkas_pengantar_opd: File | null
    berkas_sk: File | null
    berkas_daftar_gaji: File | null
    berkas_kk: File | null
    berkas_pendukung: File | null
  }>({
    berkas_pengantar_opd: null,
    berkas_sk: null,
    berkas_daftar_gaji: null,
    berkas_kk: null,
    berkas_pendukung: null,
  })

  // Default empty form
  const [formData, setFormData] = useState<Omit<SkppData, 'id' | 'created_at'>>({
    jenis_skpp: 'mutasi',
    nomor_surat: '',
    lembar: '',
    pejabat_menerangkan: 'KABID PERBENDAHARAAN, AKUNTANSI DAN PELAPORAN',
    nip: '',
    nama: '',
    tgl_lahir: '',
    golongan: 'Penata Tk.I III/d',
    unit_kerja: '',
    kd_opd1: '',
    kd_opd2: '',
    kd_opd3: '',
    kd_opd4: '',
    kd_opd5: '',
    jabatan: '',
    sk_dari: 'GUBERNUR SUMATERA UTARA',
    nomor_sk: '',
    tgl_sk: '',
    tmt_sk: '',
    mutasi_ke: '',
    alasan_pensiun: 'diberhentikan dengan hormat sebagai Pegawai Negeri Sipil',
    pensiun_pokok: 0,
    gaji_terakhir_bulan: '',

    // Penerimaan
    gaji_pokok: 0,
    tunj_istri_suami: 0,
    tunj_anak: 0,
    tunj_perb_penghasilan: 0,
    tunj_struktural: 0,
    tunj_fungsional: 0,
    tunj_beras: 0,
    tunj_umum: 0,
    tunj_fungsi_khusus: 0,
    tunj_kemahalan_daerah: 0,
    tunj_daerah_terpencil: 0,
    tunj_pajak: 0,
    tunj_kesehatan: 0,
    tunj_jkk: 0,
    tunj_jkm: 0,
    pembulatan: 0,
    jumlah_kotor: 0,

    // Potongan
    pot_iwp_1: 0,
    pot_iwp_8: 0,
    pot_askes: 0,
    pot_pajak: 0,
    pot_bulog: 0,
    pot_taperum: 0,
    iuran_korpri: 0,
    pot_sewa_rumah: 0,
    pot_hutang: 0,
    pot_jkk: 0,
    pot_jkm: 0,
    jumlah_potongan: 0,

    jumlah_bersih: 0,

    tanggungan: [],
    hutang: {
      jumlah_hutang: 0,
      keterangan: '-',
    },

    tempat_penetapan: '',
    tgl_penetapan: '',
    jabatan_penandatangan: '',
    nama_penandatangan: '',
    nip_penandatangan: '',

    tembusan: generateDefaultTembusan(),
    catatan: '',
    status: 'Draft',
  })

  // Reset file selections when dialog opens or changes
  useEffect(() => {
    setFiles({
      berkas_pengantar_opd: null,
      berkas_sk: null,
      berkas_daftar_gaji: null,
      berkas_kk: null,
      berkas_pendukung: null,
    })
  }, [open])

  useEffect(() => {
    if (isEdit && currentRow) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, created_at, ...rest } = currentRow

      const safeHutang = {
        jumlah_hutang: Number((rest as any).hutang?.jumlah_hutang ?? (rest as any).jumlah_hutang ?? 0),
        keterangan: (rest as any).hutang?.keterangan ?? (rest as any).keterangan_hutang ?? '-',
      }

      let safeTanggungan: TanggunganKeluarga[] = []
      if (Array.isArray(rest.tanggungan)) {
        safeTanggungan = rest.tanggungan
      } else if (typeof rest.tanggungan === 'string') {
        try {
          const parsed = JSON.parse(rest.tanggungan)
          if (Array.isArray(parsed)) safeTanggungan = parsed
        } catch {
          safeTanggungan = []
        }
      }

      let safeTembusan: string[] = []
      if (Array.isArray(rest.tembusan)) {
        safeTembusan = rest.tembusan
      } else if (typeof rest.tembusan === 'string') {
        try {
          const parsed = JSON.parse(rest.tembusan)
          if (Array.isArray(parsed)) safeTembusan = parsed
        } catch {
          safeTembusan = []
        }
      }
      const unitKerjaName = rest.unit_kerja || ''
      const isPendidikan = unitKerjaName.toLowerCase().includes('pendidikan')

      if (safeTembusan.length === 0) {
        safeTembusan = generateDefaultTembusan(unitKerjaName, rest.mutasi_ke, rest.jenis_skpp || 'mutasi')
      } else if (!isPendidikan) {
        const opdTarget = unitKerjaName
          ? (unitKerjaName.toLowerCase().includes('serdang bedagai') ? `${unitKerjaName};` : `${unitKerjaName} Kabupaten Serdang Bedagai;`)
          : 'SKPD Asal / Unit Kerja Terkait Kabupaten Serdang Bedagai;'

        safeTembusan = safeTembusan.map((item) => {
          if (item.toLowerCase().includes('dinas pendidikan')) {
            return item
              .replace(/Dinas Pendidikan \/ SKPD Terkait;?/gi, opdTarget)
              .replace(/Dinas Pendidikan \/ SKPD Asal\.?/gi, opdTarget)
              .replace(/Dinas Pendidikan Kabupaten Serdang Bedagai;?/gi, opdTarget)
              .replace(/Dinas Pendidikan Kabupaten Serdang Bedagai\.?/gi, opdTarget)
          }
          return item
        })
      }

      setFormData({
        ...rest,
        jenis_skpp: rest.jenis_skpp || 'mutasi',
        nomor_surat: rest.nomor_surat || '',
        lembar: rest.lembar || '',
        alasan_pensiun: rest.alasan_pensiun || 'diberhentikan dengan hormat sebagai Pegawai Negeri Sipil',
        pensiun_pokok: Number(rest.pensiun_pokok || 0),
        unit_kerja: rest.unit_kerja || '',
        kd_opd1: rest.kd_opd1 || '',
        kd_opd2: rest.kd_opd2 || '',
        kd_opd3: rest.kd_opd3 || '',
        kd_opd4: rest.kd_opd4 || '',
        kd_opd5: rest.kd_opd5 || '',
        tanggungan: safeTanggungan,
        tembusan: safeTembusan,
        hutang: safeHutang,
      })
    } else if (open === 'create') {
      const today = new Date().toISOString().substring(0, 10)
      const opdName = isBendahara && userSkpd?.nm_opd ? userSkpd.nm_opd : ''
      setFormData({
        jenis_skpp: 'mutasi',
        nomor_surat: '',
        lembar: '',
        pejabat_menerangkan: 'KABID PERBENDAHARAAN, AKUNTANSI DAN PELAPORAN',
        nip: '',
        nama: '',
        tgl_lahir: '',
        golongan: 'Penata Tk.I III/d',
        unit_kerja: opdName,
        kd_opd1: isBendahara && userSkpd?.kd_opd1 ? userSkpd.kd_opd1 : '',
        kd_opd2: isBendahara && userSkpd?.kd_opd2 ? userSkpd.kd_opd2 : '',
        kd_opd3: isBendahara && userSkpd?.kd_opd3 ? userSkpd.kd_opd3 : '',
        kd_opd4: isBendahara && userSkpd?.kd_opd4 ? userSkpd.kd_opd4 : '',
        kd_opd5: isBendahara && userSkpd?.kd_opd5 ? userSkpd.kd_opd5 : '',
        jabatan: '',
        sk_dari: 'GUBERNUR SUMATERA UTARA',
        nomor_sk: '',
        tgl_sk: today,
        tmt_sk: today,
        mutasi_ke: '',
        alasan_pensiun: 'diberhentikan dengan hormat sebagai Pegawai Negeri Sipil',
        pensiun_pokok: 0,
        gaji_terakhir_bulan: 'September 2025',

        gaji_pokok: 3799400,
        tunj_istri_suami: 379940,
        tunj_anak: 151976,
        tunj_perb_penghasilan: 0,
        tunj_struktural: 0,
        tunj_fungsional: 327000,
        tunj_beras: 289680,
        tunj_umum: 0,
        tunj_fungsi_khusus: 0,
        tunj_kemahalan_daerah: 0,
        tunj_daerah_terpencil: 0,
        tunj_pajak: 0,
        tunj_kesehatan: 186333,
        tunj_jkk: 9119,
        tunj_jkm: 27356,
        pembulatan: 92,
        jumlah_kotor: 5170896,

        pot_iwp_1: 46583,
        pot_iwp_8: 346505,
        pot_askes: 186333,
        pot_pajak: 0,
        pot_bulog: 0,
        pot_taperum: 0,
        iuran_korpri: 0,
        pot_sewa_rumah: 0,
        pot_hutang: 0,
        pot_jkk: 9119,
        pot_jkm: 27356,
        jumlah_potongan: 615896,

        jumlah_bersih: 4555000,

        tanggungan: [
          {
            id: 't-1',
            no: 1,
            nama: '',
            tgl_lahir: '',
            keterangan: 'SUAMI/ISTRI / Tertunjang',
          },
        ],
        hutang: {
          jumlah_hutang: 0,
          keterangan: '-',
        },

        tempat_penetapan: '',
        tgl_penetapan: '',
        jabatan_penandatangan: '',
        nama_penandatangan: '',
        nip_penandatangan: '',

        tembusan: generateDefaultTembusan(opdName),
        catatan: '',
        status: 'Draft',
      })
    }
  }, [isOpen, isEdit, currentRow, open, isBendahara, userSkpd])

  // Auto-resolve kd_opd untuk record lama saat diedit jika belum ada kd_opd1
  useEffect(() => {
    if (isEdit && currentRow && !formData.kd_opd1 && formData.unit_kerja && opdItems.length > 0) {
      const matched = opdItems.find(
        (opd) => opd.nm_opd?.toLowerCase() === formData.unit_kerja?.toLowerCase()
      )
      if (matched) {
        setFormData((prev) => ({
          ...prev,
          kd_opd1: matched.kd_opd1,
          kd_opd2: matched.kd_opd2,
          kd_opd3: matched.kd_opd3,
          kd_opd4: matched.kd_opd4,
          kd_opd5: matched.kd_opd5,
        }))
      }
    }
  }, [isEdit, currentRow, opdItems, formData.unit_kerja, formData.kd_opd1])

  // Pastikan untuk role Bendahara data OPD selalu terkunci ke OPD milik Bendahara & status wajib Draft
  useEffect(() => {
    if (isBendahara) {
      setFormData((prev) => ({
        ...prev,
        status: 'Draft',
        ...(userSkpd?.nm_opd && open === 'create'
          ? {
            unit_kerja: userSkpd.nm_opd,
            kd_opd1: userSkpd.kd_opd1 || '',
            kd_opd2: userSkpd.kd_opd2 || '',
            kd_opd3: userSkpd.kd_opd3 || '',
            kd_opd4: userSkpd.kd_opd4 || '',
            kd_opd5: userSkpd.kd_opd5 || '',
          }
          : {}),
      }))
    }
  }, [isBendahara, userSkpd, open])

  // Real-time recalculation of Jumlah Kotor, Jumlah Potongan, Jumlah Bersih
  const calculatedTotals = useMemo(() => {
    const kotor =
      Number(formData.gaji_pokok || 0) +
      Number(formData.tunj_istri_suami || 0) +
      Number(formData.tunj_anak || 0) +
      Number(formData.tunj_perb_penghasilan || 0) +
      Number(formData.tunj_struktural || 0) +
      Number(formData.tunj_fungsional || 0) +
      Number(formData.tunj_beras || 0) +
      Number(formData.tunj_umum || 0) +
      Number(formData.tunj_fungsi_khusus || 0) +
      Number(formData.tunj_kemahalan_daerah || 0) +
      Number(formData.tunj_daerah_terpencil || 0) +
      Number(formData.tunj_pajak || 0) +
      Number(formData.tunj_kesehatan || 0) +
      Number(formData.tunj_jkk || 0) +
      Number(formData.tunj_jkm || 0) +
      Number(formData.pembulatan || 0)

    const potongan =
      Number(formData.pot_iwp_1 || 0) +
      Number(formData.pot_iwp_8 || 0) +
      Number(formData.pot_askes || 0) +
      Number(formData.pot_pajak || 0) +
      Number(formData.pot_bulog || 0) +
      Number(formData.pot_taperum || 0) +
      Number(formData.iuran_korpri || 0) +
      Number(formData.pot_sewa_rumah || 0) +
      Number(formData.pot_hutang || 0) +
      Number(formData.pot_jkk || 0) +
      Number(formData.pot_jkm || 0)

    const bersih = kotor - potongan
    return { kotor, potongan, bersih }
  }, [
    formData.gaji_pokok,
    formData.tunj_istri_suami,
    formData.tunj_anak,
    formData.tunj_perb_penghasilan,
    formData.tunj_struktural,
    formData.tunj_fungsional,
    formData.tunj_beras,
    formData.tunj_umum,
    formData.tunj_fungsi_khusus,
    formData.tunj_kemahalan_daerah,
    formData.tunj_daerah_terpencil,
    formData.tunj_pajak,
    formData.tunj_kesehatan,
    formData.tunj_jkk,
    formData.tunj_jkm,
    formData.pembulatan,
    formData.pot_iwp_1,
    formData.pot_iwp_8,
    formData.pot_askes,
    formData.pot_pajak,
    formData.pot_bulog,
    formData.pot_taperum,
    formData.iuran_korpri,
    formData.pot_sewa_rumah,
    formData.pot_hutang,
    formData.pot_jkk,
    formData.pot_jkm,
  ])

  // Update field generic
  const updateField = (field: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Tanggungan management
  const addTanggunganRow = () => {
    setFormData((prev) => ({
      ...prev,
      tanggungan: [
        ...(prev.tanggungan || []),
        {
          id: `t-${Date.now()}`,
          no: (prev.tanggungan || []).length + 1,
          nama: '',
          tgl_lahir: '',
          keterangan: 'ANAK KANDUNG / Tertunjang',
        },
      ],
    }))
  }

  const updateTanggunganRow = (
    index: number,
    field: keyof TanggunganKeluarga,
    val: any
  ) => {
    setFormData((prev) => {
      const next = [...(prev.tanggungan || [])]
      next[index] = { ...next[index], [field]: val }
      return { ...prev, tanggungan: next }
    })
  }

  const removeTanggunganRow = (index: number) => {
    setFormData((prev) => {
      const next = (prev.tanggungan || [])
        .filter((_, i) => i !== index)
        .map((item, idx) => ({ ...item, no: idx + 1 }))
      return { ...prev, tanggungan: next }
    })
  }

  // Tembusan management
  const updateTembusanItem = (index: number, val: string) => {
    setFormData((prev) => {
      const next = [...(prev.tembusan || [])]
      next[index] = val
      return { ...prev, tembusan: next }
    })
  }

  const addTembusanItem = () => {
    setFormData((prev) => ({
      ...prev,
      tembusan: [...(prev.tembusan || []), 'Instansi / Pihak Terkait;'],
    }))
  }

  const removeTembusanItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tembusan: (prev.tembusan || []).filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.nama.trim() || !formData.nip.trim()) {
      toast.error('Nama dan NIP Pegawai harus diisi!')
      return
    }
    if (!formData.unit_kerja?.trim()) {
      toast.error('Unit Kerja Asal (OPD) harus dipilih!')
      return
    }
    if (!formData.sk_dari?.trim() || !formData.nomor_sk?.trim() || !formData.tgl_sk || !formData.tmt_sk) {
      toast.error('Data Dasar SK (SK Dari, Nomor SK, Tanggal SK, TMT SK) harus diisi!')
      return
    }
    if (!formData.gaji_terakhir_bulan?.trim()) {
      toast.error('Bulan Pembayaran Gaji Terakhir harus diisi!')
      return
    }
    if (formData.jenis_skpp === 'pensiun' && !formData.alasan_pensiun?.trim()) {
      toast.error('Alasan Pensiun harus diisi!')
      return
    }
    if (formData.jenis_skpp === 'mutasi' && !formData.mutasi_ke?.trim()) {
      toast.error('Instansi Mutasi Tujuan harus diisi!')
      return
    }

    // Validasi Wajib 5 Berkas Lampiran
    const requiredFiles = [
      { key: 'berkas_pengantar_opd', label: 'Surat Pengantar OPD' },
      { key: 'berkas_sk', label: formData.jenis_skpp === 'pensiun' ? 'SK Pensiun' : 'SK Mutasi' },
      { key: 'berkas_daftar_gaji', label: 'Daftar Gaji Terakhir' },
      { key: 'berkas_kk', label: 'FC Kartu Keluarga' },
      { key: 'berkas_pendukung', label: 'Dokumen Pendukung' },
    ] as const

    for (const f of requiredFiles) {
      const hasUploaded = Boolean(files[f.key])
      const hasExisting = Boolean(currentRow?.[f.key] || currentRow?.berkas_urls?.[f.key])
      if (!hasUploaded && !hasExisting) {
        toast.error(`Berkas ${f.label} wajib diunggah!`)
        return
      }
    }

    const user = useAuthStore.getState().user

    const payload = {
      ...formData,
      users_id: user?.id,
      user_id: user?.id,
      kd_opd1: formData.kd_opd1 || userSkpd?.kd_opd1 || '',
      kd_opd2: formData.kd_opd2 || userSkpd?.kd_opd2 || '',
      kd_opd3: formData.kd_opd3 || userSkpd?.kd_opd3 || '',
      kd_opd4: formData.kd_opd4 || userSkpd?.kd_opd4 || '',
      kd_opd5: formData.kd_opd5 || userSkpd?.kd_opd5 || '',
      status: isBendahara ? 'Draft' : formData.status,
      pensiun_pokok: Number(formData.pensiun_pokok || 0),
      alasan_pensiun: formData.alasan_pensiun || 'diberhentikan dengan hormat sebagai Pegawai Negeri Sipil',
      gaji_pokok: Number(formData.gaji_pokok || 0),
      tunj_istri_suami: Number(formData.tunj_istri_suami || 0),
      tunj_anak: Number(formData.tunj_anak || 0),
      tunj_perb_penghasilan: Number(formData.tunj_perb_penghasilan || 0),
      tunj_struktural: Number(formData.tunj_struktural || 0),
      tunj_fungsional: Number(formData.tunj_fungsional || 0),
      tunj_beras: Number(formData.tunj_beras || 0),
      tunj_umum: Number(formData.tunj_umum || 0),
      tunj_fungsi_khusus: Number(formData.tunj_fungsi_khusus || 0),
      tunj_kemahalan_daerah: Number(formData.tunj_kemahalan_daerah || 0),
      tunj_daerah_terpencil: Number(formData.tunj_daerah_terpencil || 0),
      tunj_pajak: Number(formData.tunj_pajak || 0),
      tunj_kesehatan: Number(formData.tunj_kesehatan || 0),
      tunj_jkk: Number(formData.tunj_jkk || 0),
      tunj_jkm: Number(formData.tunj_jkm || 0),
      pembulatan: Number(formData.pembulatan || 0),

      pot_iwp_1: Number(formData.pot_iwp_1 || 0),
      pot_iwp_8: Number(formData.pot_iwp_8 || 0),
      pot_askes: Number(formData.pot_askes || 0),
      pot_pajak: Number(formData.pot_pajak || 0),
      pot_bulog: Number(formData.pot_bulog || 0),
      pot_taperum: Number(formData.pot_taperum || 0),
      iuran_korpri: Number(formData.iuran_korpri || 0),
      pot_sewa_rumah: Number(formData.pot_sewa_rumah || 0),
      pot_hutang: Number(formData.pot_hutang || 0),
      pot_jkk: Number(formData.pot_jkk || 0),
      pot_jkm: Number(formData.pot_jkm || 0),

      jumlah_kotor: calculatedTotals.kotor,
      jumlah_potongan: calculatedTotals.potongan,
      jumlah_bersih: calculatedTotals.bersih,
      jumlah_hutang: Number(formData.hutang?.jumlah_hutang ?? 0),
      keterangan_hutang: formData.hutang?.keterangan ?? '-',
      hutang: {
        jumlah_hutang: Number(formData.hutang?.jumlah_hutang ?? 0),
        keterangan: formData.hutang?.keterangan ?? '-',
      },
    }

    if (!isEdit || isBendahara) {
      delete (payload as any).nama_penandatangan
      delete (payload as any).nip_penandatangan
      delete (payload as any).jabatan_penandatangan
      delete (payload as any).penandatangan_id
      delete (payload as any).penandatangan_nik
      if (!isEdit) {
        delete (payload as any).tempat_penetapan
        delete (payload as any).tgl_penetapan
      }
    }

    // Build FormData for multipart payload
    const fd = new FormData()
    Object.entries(payload).forEach(([key, val]) => {
      if (val === undefined || val === null) return
      if (typeof val === 'object') {
        fd.append(key, JSON.stringify(val))
      } else {
        fd.append(key, String(val))
      }
    })

    if (files.berkas_pengantar_opd) fd.append('berkas_pengantar_opd', files.berkas_pengantar_opd)
    if (files.berkas_sk) fd.append('berkas_sk', files.berkas_sk)
    if (files.berkas_daftar_gaji) fd.append('berkas_daftar_gaji', files.berkas_daftar_gaji)
    if (files.berkas_kk) fd.append('berkas_kk', files.berkas_kk)
    if (files.berkas_pendukung) fd.append('berkas_pendukung', files.berkas_pendukung)

    try {
      if (isEdit && currentRow) {
        await updateSkpp(currentRow.id, fd)
      } else {
        await addSkpp(fd)
      }
      setOpen(null)
    } catch {
      // error handled in provider
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(val) => !val && setOpen(null)}>
      <DialogContentLarge>
        <DialogHeader className='pb-2 border-b shrink-0'>
          <DialogTitle className='flex items-center gap-2 text-xl font-bold text-primary'>
            <FileText className='h-5 w-5' />
            {isEdit ? 'Edit Dokumen SKPP' : 'Buat Surat Keterangan Penghentian Pembayaran (SKPP)'}
          </DialogTitle>
          <DialogDescription className='text-xs'>
            Isi formulir berikut sesuai dengan data resmi SKPP BPKAD Kabupaten Serdang Bedagai.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='flex-1 flex flex-col min-h-0 gap-3'>
          <Tabs defaultValue='identitas' className='w-full flex-1 flex flex-col min-h-0'>
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
                <span className='truncate'>4. Tembusan & Catatan</span>
              </TabsTrigger>
              <TabsTrigger value='berkas' className='text-xs sm:text-sm flex items-center gap-1.5'>
                <UploadCloud className='h-4 w-4' />
                <span className='truncate'>5. Upload Berkas</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: IDENTITAS & SK */}
            <TabsContent value='identitas' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold'>
                    Jenis SKPP <span className='text-destructive'>*</span>
                  </Label>
                  <div className='grid grid-cols-2 gap-2'>
                    <button
                      type='button'
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          jenis_skpp: 'mutasi',
                          sk_dari: prev.sk_dari === 'BUPATI SERDANG BEDAGAI' ? 'GUBERNUR SUMATERA UTARA' : prev.sk_dari,
                          tembusan: generateDefaultTembusan(prev.unit_kerja, prev.mutasi_ke, 'mutasi'),
                        }))
                      }}
                      className={cn(
                        'flex items-center justify-center gap-1.5 py-2 px-3 rounded-md border text-xs font-medium transition-all',
                        formData.jenis_skpp === 'mutasi'
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                      )}
                    >
                      Pindah / Mutasi
                    </button>
                    <button
                      type='button'
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          jenis_skpp: 'pensiun',
                          sk_dari: prev.sk_dari === 'GUBERNUR SUMATERA UTARA' ? 'BUPATI SERDANG BEDAGAI' : prev.sk_dari,
                          alasan_pensiun: prev.alasan_pensiun || 'diberhentikan dengan hormat sebagai Pegawai Negeri Sipil',
                          tembusan: generateDefaultTembusan(prev.unit_kerja, prev.mutasi_ke, 'pensiun'),
                        }))
                      }}
                      className={cn(
                        'flex items-center justify-center gap-1.5 py-2 px-3 rounded-md border text-xs font-medium transition-all',
                        formData.jenis_skpp === 'pensiun'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-muted/40 hover:bg-muted text-muted-foreground'
                      )}
                    >
                      Pensiun
                    </button>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <Label className='text-xs font-semibold text-muted-foreground'>
                    Nomor Surat SKPP
                  </Label>
                  <div className='h-10 px-3 border rounded-md bg-muted/40 flex items-center justify-between text-xs font-mono'>
                    <span className='font-semibold text-foreground truncate'>
                      {isEdit && formData.nomor_surat
                        ? formData.nomor_surat
                        : 'Otomatis: 900/ [XX] /SKPP/KEU/SB/2025'}
                    </span>
                    <span className='text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-sans font-medium shrink-0 ml-1'>
                      Auto Urut dari 01
                    </span>
                  </div>
                </div>

                <div className='space-y-1.5'>
                  <div className='flex items-center justify-between'>
                    <Label htmlFor='status' className='text-xs font-semibold'>
                      Status Dokumen
                    </Label>
                    {isBendahara ? (
                      <span className='text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1'>
                        <Lock className='h-3 w-3' />
                        Wajib Draft
                      </span>
                    ) : null}
                  </div>
                  {isBendahara ? (
                    <div className='flex items-center justify-between h-10 px-3 border border-input rounded-md bg-muted/60 text-muted-foreground cursor-not-allowed select-none'>
                      <span className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400'>
                        Draft
                      </span>
                      <span className='text-[11px] text-muted-foreground italic truncate ml-1'>
                        Di-ACC Admin / Operator
                      </span>
                    </div>
                  ) : (
                    <Select
                      value={formData.status}
                      onValueChange={(val: any) => updateField('status', val)}
                    >
                      <SelectTrigger id='status'>
                        <SelectValue placeholder='Pilih Status' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='Draft'>Draft</SelectItem>
                        <SelectItem value='Diajukan'>Diajukan</SelectItem>
                        <SelectItem value='Disetujui'>Disetujui</SelectItem>
                        <SelectItem value='Diterbitkan'>Diterbitkan</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              <div className='rounded-lg border p-4 bg-muted/20 space-y-3.5'>
                <h4 className='text-sm font-semibold text-primary flex items-center gap-1.5'>
                  <UserCheck className='h-4 w-4' />
                  Data Pegawai yang Diberhentikan Pembayarannya
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='nama' className='text-xs font-semibold'>
                      Nama Pegawai (Lengkap dengan Gelar) <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='nama'
                      value={formData.nama}
                      onChange={(e) => updateField('nama', e.target.value)}
                      placeholder='EKA SYAHFITRI, A.Ma.Pd, S.Pd'
                      required
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='nip' className='text-xs font-semibold'>
                      NIP Pegawai <span className='text-destructive'>*</span>
                    </Label>
                    <Input
                      id='nip'
                      value={formData.nip}
                      onChange={(e) => updateField('nip', e.target.value)}
                      placeholder='198805192010012018'
                      required
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='tgl_lahir' className='text-xs font-semibold'>
                      Tanggal Lahir Pegawai
                    </Label>
                    <Input
                      id='tgl_lahir'
                      type='date'
                      value={formData.tgl_lahir}
                      onChange={(e) => updateField('tgl_lahir', e.target.value)}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='golongan' className='text-xs font-semibold'>
                      Pangkat / Golongan
                    </Label>
                    <Input
                      id='golongan'
                      value={formData.golongan}
                      onChange={(e) => updateField('golongan', e.target.value)}
                      placeholder='Penata Tk.I III/d'
                    />
                  </div>
                  <div className='space-y-1.5 md:col-span-2'>
                    <div className='flex items-center justify-between'>
                      <Label htmlFor='unit_kerja' className='text-xs font-semibold flex items-center gap-1.5'>
                        <Building2 className='h-3.5 w-3.5 text-primary' />
                        Unit Kerja Asal (OPD) <span className='text-destructive'>*</span>
                      </Label>
                      {isBendahara ? (
                        <span className='text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20'>
                          <Lock className='h-3 w-3' />
                          Terkunci sesuai SKPD Bendahara
                        </span>
                      ) : null}
                    </div>

                    {isBendahara ? (
                      <div className='flex items-center justify-between h-10 px-3 border border-input rounded-md bg-muted/60 text-muted-foreground cursor-not-allowed select-none'>
                        <span className='truncate font-medium text-foreground text-xs sm:text-sm'>
                          {formData.unit_kerja || userSkpd?.nm_opd || 'OPD Terdaftar'}
                        </span>
                        <div className='flex items-center gap-1.5 text-[11px] font-mono shrink-0 ml-2 text-muted-foreground'>
                          <span>
                            {[formData.kd_opd1, formData.kd_opd2, formData.kd_opd3, formData.kd_opd4, formData.kd_opd5].filter(Boolean).join('.') ||
                              [userSkpd?.kd_opd1, userSkpd?.kd_opd2, userSkpd?.kd_opd3, userSkpd?.kd_opd4, userSkpd?.kd_opd5].filter(Boolean).join('.')}
                          </span>
                          <Lock className='h-3.5 w-3.5 text-amber-600 dark:text-amber-400' />
                        </div>
                      </div>
                    ) : (
                      <Popover open={opdOpen} onOpenChange={setOpdOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            id='unit_kerja'
                            type='button'
                            variant='outline'
                            role='combobox'
                            aria-expanded={opdOpen}
                            className='w-full justify-between font-normal text-left h-10 border-input bg-background hover:bg-accent/50'
                          >
                            <span className='truncate font-medium'>
                              {formData.unit_kerja || 'Pilih Unit Kerja Asal / OPD...'}
                            </span>
                            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[480px] p-0' align='start'>
                          <Command>
                            <CommandInput placeholder='Cari nama OPD atau kode OPD...' />
                            <CommandList className='max-h-64 overflow-y-auto'>
                              {isLoadingSKPD ? (
                                <div className='py-6 text-center text-xs text-muted-foreground'>
                                  Memuat daftar OPD...
                                </div>
                              ) : null}
                              <CommandEmpty>Unit Kerja / OPD tidak ditemukan.</CommandEmpty>
                              <CommandGroup heading='Daftar OPD (REF_OPD)'>
                                {opdItems.map((opd) => {
                                  const key = [
                                    opd.kd_opd1,
                                    opd.kd_opd2,
                                    opd.kd_opd3,
                                    opd.kd_opd4,
                                    opd.kd_opd5,
                                  ]
                                    .filter(Boolean)
                                    .join('.')
                                  const isSelected =
                                    formData.unit_kerja === opd.nm_opd ||
                                    (formData.kd_opd1 === opd.kd_opd1 &&
                                      formData.kd_opd2 === opd.kd_opd2 &&
                                      formData.kd_opd3 === opd.kd_opd3 &&
                                      formData.kd_opd4 === opd.kd_opd4 &&
                                      formData.kd_opd5 === opd.kd_opd5)

                                  return (
                                    <CommandItem
                                      key={key}
                                      value={`${opd.nm_opd} ${key}`}
                                      onSelect={() => {
                                        setFormData((prev) => {
                                          const isDefaultOrGeneric =
                                            prev.tembusan.length <= 4 &&
                                            prev.tembusan.some(
                                              (t) =>
                                                t.toLowerCase().includes('skpd') ||
                                                t.toLowerCase().includes('pendidikan') ||
                                                (prev.unit_kerja && t.toLowerCase().includes(prev.unit_kerja.toLowerCase()))
                                            )

                                          return {
                                            ...prev,
                                            unit_kerja: opd.nm_opd,
                                            kd_opd1: opd.kd_opd1,
                                            kd_opd2: opd.kd_opd2,
                                            kd_opd3: opd.kd_opd3,
                                            kd_opd4: opd.kd_opd4,
                                            kd_opd5: opd.kd_opd5,
                                            tembusan: isDefaultOrGeneric
                                              ? generateDefaultTembusan(opd.nm_opd, prev.mutasi_ke)
                                              : prev.tembusan,
                                          }
                                        })
                                        setOpdOpen(false)
                                      }}
                                      className='flex items-center justify-between py-2 cursor-pointer'
                                    >
                                      <div className='flex items-center gap-2 truncate'>
                                        <Check
                                          className={cn(
                                            'h-4 w-4 shrink-0 text-primary',
                                            isSelected ? 'opacity-100' : 'opacity-0'
                                          )}
                                        />
                                        <span className='truncate font-medium text-xs'>
                                          {opd.nm_opd}
                                        </span>
                                      </div>
                                      <span className='text-[10px] font-mono text-muted-foreground shrink-0 ml-2'>
                                        {key}
                                      </span>
                                    </CommandItem>
                                  )
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    )}
                    <p className='text-[11px] text-muted-foreground'>
                      {isBendahara
                        ? 'Unit kerja/OPD terkunci otomatis sesuai OPD Bendahara yang sedang aktif.'
                        : 'Pilih unit kerja atau OPD asal tempat pegawai bertugas dari tabel referensi OPD.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className='rounded-lg border p-4 bg-muted/20 space-y-3.5'>
                <h4 className='text-sm font-semibold text-primary flex items-center gap-1.5'>
                  <FileText className='h-4 w-4' />
                  Dasar Surat Keputusan (SK) & Alasan {formData.jenis_skpp === 'pensiun' ? 'Pensiun' : 'Mutasi'}
                </h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='sk_dari' className='text-xs font-semibold'>
                      SK Dari Instansi / Pejabat
                    </Label>
                    <Input
                      id='sk_dari'
                      value={formData.sk_dari}
                      onChange={(e) => updateField('sk_dari', e.target.value)}
                      placeholder={formData.jenis_skpp === 'pensiun' ? 'BKN / PRESIDEN RI / BUPATI' : 'GUBERNUR SUMATERA UTARA'}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='nomor_sk' className='text-xs font-semibold'>
                      Nomor Surat Keputusan {formData.jenis_skpp === 'pensiun' ? 'Pensiun' : 'Mutasi'}
                    </Label>
                    <Input
                      id='nomor_sk'
                      value={formData.nomor_sk}
                      onChange={(e) => updateField('nomor_sk', e.target.value)}
                      placeholder={formData.jenis_skpp === 'pensiun' ? '00012/21124/AZ/08/25' : '800.1.3.1/477/2025'}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='tgl_sk' className='text-xs font-semibold'>
                      Tanggal SK {formData.jenis_skpp === 'pensiun' ? 'Pensiun' : 'Mutasi'}
                    </Label>
                    <Input
                      id='tgl_sk'
                      type='date'
                      value={formData.tgl_sk}
                      onChange={(e) => updateField('tgl_sk', e.target.value)}
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='tmt_sk' className='text-xs font-semibold'>
                      Terhitung Mulai Tanggal (TMT) {formData.jenis_skpp === 'pensiun' ? 'Pensiun' : 'Mutasi'}
                    </Label>
                    <Input
                      id='tmt_sk'
                      type='date'
                      value={formData.tmt_sk}
                      onChange={(e) => updateField('tmt_sk', e.target.value)}
                    />
                  </div>
                  {formData.jenis_skpp === 'pensiun' ? (
                    <>
                      <div className='space-y-1.5'>
                        <Label htmlFor='alasan_pensiun' className='text-xs font-semibold'>
                          Alasan Pemberhentian / Pensiun
                        </Label>
                        <Input
                          id='alasan_pensiun'
                          value={formData.alasan_pensiun || ''}
                          onChange={(e) => updateField('alasan_pensiun', e.target.value)}
                          placeholder='diberhentikan dengan hormat sebagai Pegawai Negeri Sipil'
                        />
                        <span className='text-[10px] text-muted-foreground'>
                          Format: Yang bersangkutan [alasan pemberhentian]
                        </span>
                      </div>
                      <div className='space-y-1.5'>
                        <Label htmlFor='pensiun_pokok' className='text-xs font-semibold'>
                          Pensiun Pokok Sebulan Sebesar (Rp)
                        </Label>
                        <RupiahInput
                          id='pensiun_pokok'
                          value={formData.pensiun_pokok || 0}
                          onValueChange={(val: number) => updateField('pensiun_pokok', val)}
                          placeholder='Contoh: 2.352.800'
                        />
                        <span className='text-[10px] text-muted-foreground'>
                          Format: dengan Pensiun Pokok sebulan sebesar : Rp. ...
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className='space-y-1.5'>
                      <Label htmlFor='mutasi_ke' className='text-xs font-semibold'>
                        Yang Bersangkutan Dimutasi Ke (Instansi Tujuan)
                      </Label>
                      <Input
                        id='mutasi_ke'
                        value={formData.mutasi_ke}
                        onChange={(e) => updateField('mutasi_ke', e.target.value)}
                        placeholder='PEMERINTAH KABUPATEN SERDANG BEDAGAI'
                      />
                      <span className='text-[10px] text-muted-foreground'>
                        Format: Yang bersangkutan dimutasikan ke : ...
                      </span>
                    </div>
                  )}
                  <div className='space-y-1.5'>
                    <Label htmlFor='gaji_terakhir_bulan' className='text-xs font-semibold'>
                      Gaji Telah Dibayarkan Sampai Akhir Bulan
                    </Label>
                    <Input
                      id='gaji_terakhir_bulan'
                      value={formData.gaji_terakhir_bulan}
                      onChange={(e) => updateField('gaji_terakhir_bulan', e.target.value)}
                      placeholder='September 2025'
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 2: RINCIAN GAJI & POTONGAN */}
            <TabsContent value='gaji' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
              {/* Summary Bar */}
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sticky top-0 z-10 bg-background/95 backdrop-blur pb-2'>
                <Card className='border-blue-200 dark:border-blue-900 bg-blue-50/70 dark:bg-blue-950/30'>
                  <CardContent className='p-3'>
                    <span className='text-xs text-muted-foreground block font-medium'>
                      Jumlah Kotor (A)
                    </span>
                    <span className='text-lg font-bold text-blue-700 dark:text-blue-400'>
                      Rp {calculatedTotals.kotor.toLocaleString('id-ID')}
                    </span>
                  </CardContent>
                </Card>

                <Card className='border-amber-200 dark:border-amber-900 bg-amber-50/70 dark:bg-amber-950/30'>
                  <CardContent className='p-3'>
                    <span className='text-xs text-muted-foreground block font-medium'>
                      Jumlah Potongan (B)
                    </span>
                    <span className='text-lg font-bold text-amber-700 dark:text-amber-400'>
                      Rp {calculatedTotals.potongan.toLocaleString('id-ID')}
                    </span>
                  </CardContent>
                </Card>

                <Card className='border-emerald-200 dark:border-emerald-900 bg-emerald-50/70 dark:bg-emerald-950/30'>
                  <CardContent className='p-3'>
                    <span className='text-xs text-muted-foreground block font-medium'>
                      Jumlah Bersih (A - B)
                    </span>
                    <span className='text-lg font-bold text-emerald-700 dark:text-emerald-400'>
                      Rp {calculatedTotals.bersih.toLocaleString('id-ID')}
                    </span>
                  </CardContent>
                </Card>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
                {/* A. PENERIMAAN */}
                <div className='rounded-lg border p-4 space-y-3 bg-muted/10'>
                  <div className='flex items-center justify-between border-b pb-2.5'>
                    <h4 className='text-xs font-bold uppercase text-primary tracking-wide'>
                      A. Penerimaan
                    </h4>
                    <span className='text-xs font-semibold text-blue-600 dark:text-blue-400'>
                      Total: Rp {calculatedTotals.kotor.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className='grid grid-cols-1 gap-2.5'>
                    {[
                      { key: 'gaji_pokok', label: '1. Gaji Pokok' },
                      { key: 'tunj_istri_suami', label: '2. Tunjangan Istri/Suami' },
                      { key: 'tunj_anak', label: '3. Tunjangan Anak' },
                      { key: 'tunj_perb_penghasilan', label: '4. Tunj. Perb. Penghasilan' },
                      { key: 'tunj_struktural', label: '5. Tunjangan Struktural' },
                      { key: 'tunj_fungsional', label: '6. Tunjangan Fungsional' },
                      { key: 'tunj_beras', label: '7. Tunjangan Beras' },
                      { key: 'tunj_umum', label: '8. Tunjangan Umum' },
                      { key: 'tunj_fungsi_khusus', label: '9. Tunjangan Fungsi Khusus' },
                      { key: 'tunj_kemahalan_daerah', label: '10. Tunjangan Kemahalan Daerah' },
                      { key: 'tunj_daerah_terpencil', label: '11. Tunjangan Daerah Terpencil' },
                      { key: 'tunj_pajak', label: '12. Tunjangan Pajak' },
                      { key: 'tunj_kesehatan', label: '13. Tunjangan Kesehatan' },
                      { key: 'tunj_jkk', label: '14. Tunjangan JKK' },
                      { key: 'tunj_jkm', label: '15. Tunjangan JKM' },
                      { key: 'pembulatan', label: '16. Pembulatan' },
                    ].map(({ key, label }) => (
                      <div key={key} className='flex items-center justify-between gap-3 text-xs'>
                        <Label htmlFor={key} className='text-xs text-muted-foreground w-1/2'>
                          {label}
                        </Label>
                        <RupiahInput
                          id={key}
                          className='h-8 text-xs font-medium text-right w-1/2'
                          value={(formData as any)[key] ?? 0}
                          onValueChange={(numericVal) => updateField(key as any, numericVal)}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* B. POTONGAN */}
                <div className='rounded-lg border p-4 space-y-3 bg-muted/10'>
                  <div className='flex items-center justify-between border-b pb-2.5'>
                    <h4 className='text-xs font-bold uppercase text-primary tracking-wide'>
                      B. Potongan-Potongan
                    </h4>
                    <span className='text-xs font-semibold text-amber-600 dark:text-amber-400'>
                      Total: Rp {calculatedTotals.potongan.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className='grid grid-cols-1 gap-2.5'>
                    {[
                      { key: 'pot_iwp_1', label: '1. Pot IWP 1%' },
                      { key: 'pot_iwp_8', label: '2. Pot IWP 8%' },
                      { key: 'pot_askes', label: '3. Potongan Askes' },
                      { key: 'pot_pajak', label: '4. Potongan Pajak' },
                      { key: 'pot_bulog', label: '5. Potongan BULOG' },
                      { key: 'pot_taperum', label: '6. Potongan Taperum' },
                      { key: 'iuran_korpri', label: '7. Iuran KORPRI' },
                      { key: 'pot_sewa_rumah', label: '8. Potongan Sewa Rumah' },
                      { key: 'pot_hutang', label: '9. Potongan Hutang' },
                      { key: 'pot_jkk', label: '10. Potongan JKK' },
                      { key: 'pot_jkm', label: '11. Potongan JKM' },
                    ].map(({ key, label }) => (
                      <div key={key} className='flex items-center justify-between gap-3 text-xs'>
                        <Label htmlFor={key} className='text-xs text-muted-foreground w-1/2'>
                          {label}
                        </Label>
                        <RupiahInput
                          id={key}
                          className='h-8 text-xs font-medium text-right w-1/2'
                          value={(formData as any)[key] ?? 0}
                          onValueChange={(numericVal) => updateField(key as any, numericVal)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 3: TANGGUNGAN KELUARGA & HUTANG */}
            <TabsContent value='tanggungan' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
              {/* Tanggungan Keluarga */}
              <div className='rounded-lg border p-3.5 space-y-3'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h4 className='text-sm font-semibold text-primary flex items-center gap-1.5'>
                      <Users className='h-4 w-4' />
                      Daftar Keluarga yang Menjadi Tanggungan
                    </h4>
                    <p className='text-xs text-muted-foreground'>
                      Daftar suami/istri dan anak kandung yang tertunjang dalam gaji.
                    </p>
                  </div>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={addTanggunganRow}
                    className='h-8 text-xs'
                  >
                    <Plus className='h-3.5 w-3.5 mr-1' />
                    Tambah Baris
                  </Button>
                </div>

                <div className='space-y-2.5'>
                  {formData.tanggungan.length > 0 && (
                    <div className='hidden sm:grid sm:grid-cols-12 gap-3 text-xs font-semibold text-muted-foreground px-3 py-1'>
                      <div className='col-span-1 text-center'>No</div>
                      <div className='col-span-4'>Nama Anggota Keluarga</div>
                      <div className='col-span-3'>Tanggal Lahir</div>
                      <div className='col-span-3'>Hubungan / Keterangan</div>
                      <div className='col-span-1 text-center'>Aksi</div>
                    </div>
                  )}
                  {formData.tanggungan.map((item, idx) => (
                    <div
                      key={item.id || idx}
                      className='flex flex-col sm:grid sm:grid-cols-12 items-center gap-3 p-3 rounded-lg border bg-muted/20 hover:bg-muted/30 transition-colors'
                    >
                      <div className='col-span-1 flex justify-center w-full sm:w-auto'>
                        <span className='text-xs font-bold px-2.5 py-1 bg-muted rounded'>
                          #{idx + 1}
                        </span>
                      </div>
                      <div className='col-span-4 w-full'>
                        <Input
                          placeholder='Nama Anggota Keluarga'
                          value={item.nama}
                          onChange={(e) => updateTanggunganRow(idx, 'nama', e.target.value)}
                          className='h-8 text-xs font-medium'
                        />
                      </div>
                      <div className='col-span-3 w-full'>
                        <Input
                          type='date'
                          value={item.tgl_lahir}
                          onChange={(e) => updateTanggunganRow(idx, 'tgl_lahir', e.target.value)}
                          className='h-8 text-xs'
                        />
                      </div>
                      <div className='col-span-3 w-full'>
                        <Input
                          placeholder='SUAMI/ISTRI / ANAK KANDUNG'
                          value={item.keterangan}
                          onChange={(e) => updateTanggunganRow(idx, 'keterangan', e.target.value)}
                          className='h-8 text-xs'
                        />
                      </div>
                      <div className='col-span-1 flex justify-center w-full sm:w-auto'>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          onClick={() => removeTanggunganRow(idx)}
                          className='h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {formData.tanggungan.length === 0 && (
                    <div className='text-center py-6 text-xs text-muted-foreground border border-dashed rounded-md'>
                      Belum ada anggota keluarga tanggungan yang ditambahkan.
                    </div>
                  )}
                </div>
              </div>

              {/* Data Hutang */}
              <div className='rounded-lg border p-3.5 space-y-3'>
                <h4 className='text-sm font-semibold text-primary'>Data Hutang</h4>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                  <div className='space-y-1.5'>
                    <Label htmlFor='jumlah_hutang' className='text-xs font-semibold'>
                      Jumlah Hutang (Rp.)
                    </Label>
                    <RupiahInput
                      id='jumlah_hutang'
                      value={formData.hutang?.jumlah_hutang ?? 0}
                      onValueChange={(numericVal) =>
                        setFormData((prev) => ({
                          ...prev,
                          hutang: {
                            jumlah_hutang: numericVal,
                            keterangan: prev.hutang?.keterangan ?? '-',
                          },
                        }))
                      }
                      placeholder='Rp 0'
                    />
                  </div>
                  <div className='space-y-1.5'>
                    <Label htmlFor='keterangan_hutang' className='text-xs font-semibold'>
                      Keterangan Hutang
                    </Label>
                    <Input
                      id='keterangan_hutang'
                      value={formData.hutang?.keterangan ?? '-'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          hutang: {
                            jumlah_hutang: prev.hutang?.jumlah_hutang ?? 0,
                            keterangan: e.target.value,
                          },
                        }))
                      }
                      placeholder='Contoh: Bank Sumut / Nihil / -'
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* TAB 4: TEMBUSAN & CATATAN */}
            <TabsContent value='pengesahan' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
              {/* Tembusan SKPP */}
              <div className='rounded-lg border p-4 space-y-3.5'>
                <div className='flex items-center justify-between flex-wrap gap-2'>
                  <div>
                    <h4 className='text-sm font-semibold text-primary'>Tembusan SKPP</h4>
                    <p className='text-[11px] text-muted-foreground'>
                      Daftar tembusan resmi disesuaikan otomatis dengan OPD asal dan instansi mutasi.
                    </p>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Button
                      type='button'
                      variant='secondary'
                      size='sm'
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          tembusan: generateDefaultTembusan(prev.unit_kerja, prev.mutasi_ke),
                        }))
                        toast.info('Daftar tembusan disinkronkan dengan OPD asal dan tujuan')
                      }}
                      className='h-8 text-xs'
                    >
                      <RefreshCw className='h-3.5 w-3.5 mr-1' />
                      Sinkronkan OPD
                    </Button>
                    <Button
                      type='button'
                      variant='outline'
                      size='sm'
                      onClick={addTembusanItem}
                      className='h-8 text-xs'
                    >
                      <Plus className='h-3.5 w-3.5 mr-1' />
                      Tambah Tembusan
                    </Button>
                  </div>
                </div>
                <div className='space-y-2.5'>
                  {formData.tembusan.map((item, idx) => (
                    <div key={idx} className='flex items-center gap-2'>
                      <span className='text-xs font-semibold w-6 text-muted-foreground'>
                        {idx + 1}.
                      </span>
                      <Input
                        value={item}
                        onChange={(e) => updateTembusanItem(idx, e.target.value)}
                        className='h-8 text-xs flex-1'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='icon'
                        onClick={() => removeTembusanItem(idx)}
                        className='h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0'
                      >
                        <Trash2 className='h-3.5 w-3.5' />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className='space-y-1.5'>
                <Label htmlFor='catatan' className='text-xs font-semibold'>
                  Catatan Tambahan
                </Label>
                <Textarea
                  id='catatan'
                  rows={2}
                  value={formData.catatan}
                  onChange={(e) => updateField('catatan', e.target.value)}
                  placeholder='Catatan khusus jika ada...'
                />
              </div>
            </TabsContent>

            {/* TAB 5: UPLOAD BERKAS */}
            <TabsContent value='berkas' className='space-y-4 pt-3 flex-1 overflow-y-auto pr-2'>
              <div className='p-3.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg text-xs space-y-1 text-blue-900 dark:text-blue-200'>
                <div className='font-semibold flex items-center gap-1.5'>
                  <UploadCloud className='h-4 w-4 text-blue-600' />
                  Persyaratan Dokumen & Berkas Kelengkapan SKPP
                </div>
                <p className='text-muted-foreground text-[11px] leading-relaxed'>
                  Unggah berkas kelengkapan pengajuan SKPP dalam format PDF atau Gambar (Maks 10MB per file). Berkas ini akan diperiksa oleh Tim Verifikator / Operator BPKAD.
                </p>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <FileUploadCard
                  title='Surat Pengantar dari OPD'
                  description='Surat pengantar resmi dari pimpinan OPD pengusul SKPP.'
                  required
                  file={files.berkas_pengantar_opd}
                  existingUrl={currentRow?.berkas_urls?.berkas_pengantar_opd || (currentRow?.berkas_pengantar_opd ? `/api/skpp/${currentRow.id}/berkas/berkas_pengantar_opd` : undefined)}
                  onFileSelect={(f) => setFiles((prev) => ({ ...prev, berkas_pengantar_opd: f }))}
                />

                <FileUploadCard
                  title={formData.jenis_skpp === 'pensiun' ? 'SK Pensiun' : 'SK Mutasi / Pindah'}
                  description={`Salinan sah Surat Keputusan ${formData.jenis_skpp === 'pensiun' ? 'Pensiun dari BKN/Presiden' : 'Mutasi/Pindah Tugas'}.`}
                  required
                  file={files.berkas_sk}
                  existingUrl={currentRow?.berkas_urls?.berkas_sk || (currentRow?.berkas_sk ? `/api/skpp/${currentRow.id}/berkas/berkas_sk` : undefined)}
                  onFileSelect={(f) => setFiles((prev) => ({ ...prev, berkas_sk: f }))}
                />

                <FileUploadCard
                  title='Daftar Gaji Terakhir'
                  description='Daftar gaji / slip gaji resmi bulan terakhir yang dibayarkan.'
                  required
                  file={files.berkas_daftar_gaji}
                  existingUrl={currentRow?.berkas_urls?.berkas_daftar_gaji || (currentRow?.berkas_daftar_gaji ? `/api/skpp/${currentRow.id}/berkas/berkas_daftar_gaji` : undefined)}
                  onFileSelect={(f) => setFiles((prev) => ({ ...prev, berkas_daftar_gaji: f }))}
                />

                <FileUploadCard
                  title='Fotocopy Kartu Keluarga (KK)'
                  description='FC Kartu Keluarga terbaru untuk pencocokan tertanggung keluarga.'
                  required
                  file={files.berkas_kk}
                  existingUrl={currentRow?.berkas_urls?.berkas_kk || (currentRow?.berkas_kk ? `/api/skpp/${currentRow.id}/berkas/berkas_kk` : undefined)}
                  onFileSelect={(f) => setFiles((prev) => ({ ...prev, berkas_kk: f }))}
                />

                <div className='md:col-span-2'>
                  <FileUploadCard
                    title='Dokumen Pendukung Lainnya (Jika Diperlukan)'
                    description='FC Ijazah terakhir anak, FC Akta Kematian/Cerai, atau bukti jiwa tertanggung sebelumnya.'
                    required={false}
                    file={files.berkas_pendukung}
                    existingUrl={currentRow?.berkas_urls?.berkas_pendukung || (currentRow?.berkas_pendukung ? `/api/skpp/${currentRow.id}/berkas/berkas_pendukung` : undefined)}
                    onFileSelect={(f) => setFiles((prev) => ({ ...prev, berkas_pendukung: f }))}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className='pt-3 border-t shrink-0 flex items-center justify-between gap-3 sm:justify-between'>
            <div className='text-xs text-muted-foreground hidden sm:block'>
              Gaji Bersih: <span className='font-bold text-emerald-600 dark:text-emerald-400'>Rp {calculatedTotals.bersih.toLocaleString('id-ID')}</span>
            </div>
            <div className='flex items-center gap-2'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setOpen(null)}
              >
                Batal
              </Button>
              <Button type='submit'>
                {isEdit ? 'Simpan Perubahan' : 'Terbitkan SKPP'}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContentLarge>
    </Dialog>
  )
}
