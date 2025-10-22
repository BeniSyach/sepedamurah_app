import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface CeklisKelengkapanDokumen {
  id: string
  kategori: string
  status: string
  date_created: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface CeklisKelengkapanDokumenResponse {
  data: CeklisKelengkapanDokumen[]
  links: PaginationLinks
  meta: PaginationMeta
}
