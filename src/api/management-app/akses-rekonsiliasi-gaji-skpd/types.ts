import type { RefRekonsiliasiGajiSkpd } from '@/api/master-data'
import type { PaginationMeta } from '@/api/users'

// Type untuk 1 SKPD beserta list DPA-nya
export interface AksesRefRekonsiliasiGajiSkpdGroup {
  kode_opd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_opd: string
  rekonsiliasi: RefRekonsiliasiGajiSkpd[]
  tahun: string
}

// Type response API
export interface AksesRefRekonsiliasiGajiSkpdResponse {
  status: boolean
  message: string
  data: AksesRefRekonsiliasiGajiSkpdGroup[]
  meta: PaginationMeta
}

export interface CekLaporanRekonsiliasiGajiSkpdItem {
  akses_id: number
  opd: string
  dpa_id: string
  nama_dpa: string | null
  status_laporan: boolean
  laporan_data: string | null
}

export interface KurangUploadRekonsiliasiGajiSkpdItem {
  dpa_id: string
  nama_dpa: string
  opd: string
  pesan: string
}

export interface CekLaporanRekonsiliasiGajiSkpdResponse {
  status: boolean
  status_laporan_memenuhi: boolean
  data: CekLaporanRekonsiliasiGajiSkpdItem[]
  kurang_upload: KurangUploadRekonsiliasiGajiSkpdItem[]
}
