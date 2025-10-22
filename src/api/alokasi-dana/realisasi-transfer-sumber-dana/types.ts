import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface RealisasiTransferSumberDana {
  id: string
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  nm_sumber: string
  tgl_diterima: string
  tahun: string
  jumlah_sumber: number
  keterangan: number | string
  keterangan_2: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface RealisasiTransferSumberDanaResponse {
  data: RealisasiTransferSumberDana[]
  links: PaginationLinks
  meta: PaginationMeta
}
