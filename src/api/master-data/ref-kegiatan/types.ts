import { type PaginationLinks } from '@/api/users'

export interface Kegiatan {
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
  nm_kegiatan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface KegiatanLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

interface KegiatanMeta {
  current_page: number
  from: number
  last_page: number
  links: PaginationLinks[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface KegiatanResponse {
  data: Kegiatan[]
  links: KegiatanLinks
  meta: KegiatanMeta
}
