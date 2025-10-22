import type { PaginationLink } from '../../users'

export interface BidangUrusan {
  kd_bu1: string
  kd_bu2: string
  nm_bu: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface BidangUrusanLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface BidangUrusanMeta {
  current_page: number
  from: number | null
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface BidangUrusanResponse {
  data: BidangUrusan[]
  links: BidangUrusanLinks
  meta: BidangUrusanMeta
}
