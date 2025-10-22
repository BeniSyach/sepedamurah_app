import { type MasterSkpd } from '@/api/master-data'
import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface UpSkpd {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  tahun: string
  pagu: string // disimpan sebagai string dari API
  up_kkpd: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  skpd: MasterSkpd
}

export interface UpSkpdResponse {
  data: UpSkpd[]
  links: PaginationLinks
  meta: PaginationMeta
}
