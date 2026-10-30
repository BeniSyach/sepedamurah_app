export interface TanggunganKeluarga {
  id: string
  no: number
  nama: string
  tgl_lahir: string
  keterangan: string
}

export interface DataHutang {
  jumlah_hutang: number
  keterangan: string
}

export interface SkppData {
  id: string
  nomor_surat: string
  lembar: string
  pejabat_menerangkan: string

  // Data Pegawai
  nip: string
  nama: string
  tgl_lahir: string
  golongan: string
  unit_kerja: string
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
  jabatan?: string

  // Dasar SK & Mutasi
  sk_dari: string
  nomor_sk: string
  tgl_sk: string
  tmt_sk: string
  mutasi_ke: string
  gaji_terakhir_bulan: string

  // A. Penerimaan
  gaji_pokok: number
  tunj_istri_suami: number
  tunj_anak: number
  tunj_perb_penghasilan: number
  tunj_struktural: number
  tunj_fungsional: number
  tunj_beras: number
  tunj_umum: number
  tunj_fungsi_khusus: number
  tunj_kemahalan_daerah: number
  tunj_daerah_terpencil: number
  tunj_pajak: number
  tunj_kesehatan: number
  tunj_jkk: number
  tunj_jkm: number
  pembulatan: number
  jumlah_kotor: number

  // B. Potongan-potongan
  pot_iwp_1: number
  pot_iwp_8: number
  pot_askes: number
  pot_pajak: number
  pot_bulog: number
  pot_taperum: number
  iuran_korpri: number
  pot_sewa_rumah: number
  pot_hutang: number
  pot_jkk: number
  pot_jkm: number
  jumlah_potongan: number

  // Jumlah Bersih
  jumlah_bersih: number

  // Daftar Keluarga Tanggungan
  tanggungan: TanggunganKeluarga[]

  // Data Hutang
  hutang: DataHutang

  // Penandatanganan
  tempat_penetapan: string
  tgl_penetapan: string
  jabatan_penandatangan: string
  nama_penandatangan: string
  nip_penandatangan: string

  // Tembusan
  tembusan: string[]
  catatan?: string

  status: 'Draft' | 'Diajukan' | 'Permohonan' | 'Disetujui' | 'Diterbitkan' | 'Diterima' | 'Ditolak' | 'Perlu Perbaikan'
  alasan_tolak?: string | null
  catatan_perbaikan?: string | null
  tgl_diterima?: string | null
  tgl_ditolak?: string | null
  operator_id?: string | null
  operator_nama?: string | null
  status_tte?: string | null
  berkas_tte?: string | null
  
  // Jenis & Nomor Otomatis & Pensiun
  jenis_skpp?: 'pensiun' | 'mutasi'
  nomor_urut?: number
  pensiun_pokok?: number
  alasan_pensiun?: string

  // Upload Berkas
  berkas_pengantar_opd?: string | null
  berkas_sk?: string | null
  berkas_daftar_gaji?: string | null
  berkas_kk?: string | null
  berkas_pendukung?: string | null
  berkas_urls?: {
    berkas_pengantar_opd?: string | null
    berkas_sk?: string | null
    berkas_daftar_gaji?: string | null
    berkas_kk?: string | null
    berkas_pendukung?: string | null
  }
  verifikasi_berkas?: Record<string, { status: 'valid' | 'perlu_perbaikan' | 'tidak_valid'; catatan?: string }>

  users_id?: string | number | null
  pembuat?: {
    id?: string | number | null
    nama?: string
    nip?: string
    email?: string | null
  }
  tanggal_upload?: string | null
  created_at: string
}



export function formatRupiah(amount?: number | null): string {
  return `Rp ${(amount || 0).toLocaleString('id-ID')}`
}

