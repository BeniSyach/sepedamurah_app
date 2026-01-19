import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface PaguBelanja {
  id_pb: string
  tahun_rek: string | null
  kd_berapax: string | null
  jumlah_pagu: string

  nm_opd: string
  nm_urusan: string
  nm_bu: string
  nm_program: string
  nm_kegiatan: string
  nm_subkegiatan: string
  nm_rekening: string

  created_at: string
}

export interface PaguBelanjaResponse {
  data: PaguBelanja[]
  links: PaginationLinks
  meta: PaginationMeta
}
