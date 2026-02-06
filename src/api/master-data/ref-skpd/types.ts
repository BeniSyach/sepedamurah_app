import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface MasterSkpd {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nm_opd: string
  status_penerimaan: string
  kode_opd: string
  hidden: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  is_active: string
}

export interface MasterSkpdResponse {
  data: MasterSkpd[]
  links: PaginationLinks
  meta: PaginationMeta
}
