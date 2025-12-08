import type { PaginationMeta } from '@/api/users'

// Type untuk 1 item DPA
export interface DPAItem {
  id: number
  nm_dpa: string
}

// Type untuk 1 SKPD beserta list DPA-nya
export interface AksesDPAGroup {
  kode_opd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_opd: string
  dpa: DPAItem[]
  tahun: string
}

// Type response API
export interface AksesDPAResponse {
  status: boolean
  message: string
  data: AksesDPAGroup[]
  meta: PaginationMeta
}
