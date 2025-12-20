import type { RefSp2dbToBUD } from '@/api/master-data'
import type { PaginationMeta } from '@/api/users'

// Type untuk 1 SKPD beserta list Sp2bToBUD-nya
export interface AksesSp2bToBUDGroup {
  kode_opd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_opd: string
  sp2b: RefSp2dbToBUD[]
  tahun: string
}

// Type response API
export interface AksesSp2bToBUDResponse {
  status: boolean
  message: string
  data: AksesSp2bToBUDGroup[]
  meta: PaginationMeta
}

export interface CekLaporanSp2bToBUDItem {
  akses_id: number
  opd: string
  ref_sp2b_id: string
  nama_sp2b: string | null
  status_laporan: boolean
  laporan_data: string | null
}

export interface KurangUploadItemSp2bToBUD {
  ref_sp2b_id: string
  nama_sp2b: string
  opd: string
  pesan: string
}

export interface CekLaporanSp2bToBUDResponse {
  status: boolean
  status_laporan_memenuhi: boolean
  data: CekLaporanSp2bToBUDItem[]
  kurang_upload: KurangUploadItemSp2bToBUD[]
}
