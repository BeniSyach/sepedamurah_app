import type { PaginationLink } from '../../users'

export interface SubKegiatan {
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
  nm_subkegiatan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SubKegiatanLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

export interface SubKegiatanMeta {
  current_page: number
  from: number
  last_page: number
  links: PaginationLink[] // { url, label, active }
  path: string
  per_page: number
  to: number
  total: number
}

export interface SubKegiatanResponse {
  data: SubKegiatan[]
  links: SubKegiatanLinks
  meta: SubKegiatanMeta
}
