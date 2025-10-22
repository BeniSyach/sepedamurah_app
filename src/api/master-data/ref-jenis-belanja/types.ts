import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface JenisBelanja {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  nm_belanja: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface JenisBelanjaResponse {
  data: JenisBelanja[]
  links: PaginationLinks
  meta: PaginationMeta
}
