import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface PaguBelanja {
  id_pb: string
  tahun_rek: string
  kd_berapax: string
  jumlah_pagu: string

  nm_opd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  kd_opd6: string
  kd_opd7: string
  kd_opd8: string
  nm_urusan: string
  kd_urusan: string
  nm_bu: string
  kd_bu1: string
  kd_bu2: string
  nm_program: string
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
  nm_kegiatan: string
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
  nm_subkegiatan: string
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
  nm_rekening: string
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string

  created_at: string
}

export interface PaguBelanjaResponse {
  data: PaguBelanja[]
  links: PaginationLinks
  meta: PaginationMeta
}
