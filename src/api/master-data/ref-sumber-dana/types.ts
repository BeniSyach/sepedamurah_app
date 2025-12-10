import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface SumberDana {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
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
