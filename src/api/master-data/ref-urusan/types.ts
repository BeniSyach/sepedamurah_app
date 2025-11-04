import type { PaginationLink } from '../../users'

export interface Urusan {
  kd_urusan: string
  nm_urusan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface UrusanLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

interface UrusanMeta {
  current_page: number
  from: number
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface UrusanResponse {
  data: Urusan[]
  links: UrusanLinks
  meta: UrusanMeta
}
