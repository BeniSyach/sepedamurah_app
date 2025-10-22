import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface Rekening {
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string
  nm_rekening: string
  created_at: string
  updated_at: string
}

export interface RekeningResponse {
  data: Rekening[]
  links: PaginationLinks
  meta: PaginationMeta
}
