import type { RefAssetBendahara } from '@/api/master-data'
import type { PaginationMeta } from '@/api/users'

// Type untuk 1 SKPD beserta list AssetBendahara-nya
export interface AksesAssetBendaharaGroup {
  kode_opd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_opd: string
  asset: RefAssetBendahara[]
  tahun: string
}

// Type response API
export interface AksesAssetBendaharaResponse {
  status: boolean
  message: string
  data: AksesAssetBendaharaGroup[]
  meta: PaginationMeta
}

export interface CekLaporanAssetBendaharaItem {
  akses_id: number
  opd: string
  ref_asset_id: string
  nama_asset: string | null
  status_laporan: boolean
  laporan_data: string | null
}

export interface KurangUploadItemAssetBendahara {
  ref_asset_id: string
  nama_asset: string
  opd: string
  pesan: string
}

export interface CekLaporanAssetBendaharaResponse {
  status: boolean
  status_laporan_memenuhi: boolean
  data: CekLaporanAssetBendaharaItem[]
  kurang_upload: KurangUploadItemAssetBendahara[]
}
