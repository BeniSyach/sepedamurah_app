import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface JenisSpm {
  id: string
  kategori: string
  nama_berkas: string
  status_penerimaan: string
  date_created: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface JenisSpmResponse {
  data: JenisSpm[]
  links: PaginationLinks
  meta: PaginationMeta
}
