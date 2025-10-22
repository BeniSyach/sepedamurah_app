import { type SumberDana } from '@/api/master-data'
import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface PaguSumberDana {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  tahun: string
  tgl_rekam: string
  pagu: string
  jumlah_silpa: number
  created_at: string
  updated_at: string
  deleted_at: string | null
  sumber_dana: SumberDana
}

export interface PaguSumberDanaResponse {
  data: PaguSumberDana[]
  links: PaginationLinks
  meta: PaginationMeta
}
