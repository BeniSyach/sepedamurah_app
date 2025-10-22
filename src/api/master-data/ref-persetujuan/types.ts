import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface Persetujuan {
  id: string
  konten: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface PersetujuanResponse {
  data: Persetujuan[]
  links: PaginationLinks
  meta: PaginationMeta
}
