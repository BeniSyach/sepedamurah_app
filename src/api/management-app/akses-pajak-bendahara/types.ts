import type { RefPajakBendahara } from '@/api/master-data'
import type { PaginationMeta } from '@/api/users'

// Type untuk 1 SKPD beserta list PajakBendahara-nya
export interface AksesPajakBendaharaGroup {
  kode_opd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_opd: string
  pajak: RefPajakBendahara[]
  tahun: string
}

// Type response API
export interface AksesPajakBendaharaResponse {
  status: boolean
  message: string
  data: AksesPajakBendaharaGroup[]
  meta: PaginationMeta
}

export interface CekLaporanPajakBendaharaItem {
  akses_id: number
  opd: string
  ref_pajak_id: string
  nama_pajak: string | null
  status_laporan: boolean
  laporan_data: string | null
}

export interface KurangUploadItemPajakBendahara {
  ref_pajak_id: string
  nama_pajak: string
  opd: string
  pesan: string
}

export interface CekLaporanPajakBendaharaResponse {
  status: boolean
  status_laporan_memenuhi: boolean
  data: CekLaporanPajakBendaharaItem[]
  kurang_upload: KurangUploadItemPajakBendahara[]
}
