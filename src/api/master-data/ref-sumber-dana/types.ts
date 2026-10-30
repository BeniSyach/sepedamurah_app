import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface SumberDana {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  kd_pagu_sd1?: string | null
  kd_pagu_sd2?: string | null
  kd_pagu_sd3?: string | null
  kd_pagu_sd4?: string | null
  kd_pagu_sd5?: string | null
  kd_pagu_sd6?: string | null
  nm_ref: string
  status: string
  jenis_sumber_dana: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SumberDanaResponse {
  data: SumberDana[]
  links: PaginationLinks
  meta: PaginationMeta
}
