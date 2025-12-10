import type { RefDpa } from '@/api/master-data'
import type { PaginationMeta } from '@/api/users'

// Type untuk 1 SKPD beserta list DPA-nya
export interface AksesDPAGroup {
  kode_opd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_opd: string
  dpa: RefDpa[]
  tahun: string
}

// Type response API
export interface AksesDPAResponse {
  status: boolean
  message: string
  data: AksesDPAGroup[]
  meta: PaginationMeta
}

export interface CekLaporanDPAItem {
  akses_id: number
  opd: string
  dpa_id: string
  nama_dpa: string | null
  status_laporan: boolean
  laporan_data: string | null
}

export interface KurangUploadItem {
  dpa_id: string
  nama_dpa: string
  opd: string
  pesan: string
}

export interface CekLaporanDPAResponse {
  status: boolean
  status_laporan_memenuhi: boolean
  data: CekLaporanDPAItem[]
  kurang_upload: KurangUploadItem[]
}
