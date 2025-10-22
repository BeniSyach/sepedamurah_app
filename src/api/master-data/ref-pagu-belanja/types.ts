import type { PaginationLinks, PaginationMeta } from '@/api/users'
import { type BidangUrusan } from '../ref-bidang-urusan'
import { type Kegiatan } from '../ref-kegiatan'
import { type Program } from '../ref-program'
import { type Rekening } from '../ref-rekening'
import { type MasterSkpd } from '../ref-skpd'
import { type SubKegiatan } from '../ref-subkegiatan'
import { type Urusan } from '../ref-urusan'

export interface PaguBelanja {
  id_pb: string
  tahun_rek: string | null
  kd_urusan: string
  urusan: Urusan
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
  program: Program
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
  kegiatan: Kegiatan
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
  subkegiatan: SubKegiatan
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string
  rekening: Rekening
  jumlah_pagu: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  kd_opd6: string
  kd_opd7: string
  kd_opd8: string
  skpd: MasterSkpd
  kd_bu1: string
  kd_bu2: string
  bu: BidangUrusan
  kd_relasi: string | null
  kd_berapax: string | null
  created_at: string
  updated_at: string
}

export interface PaguBelanjaResponse {
  data: PaguBelanja[]
  links: PaginationLinks
  meta: PaginationMeta
}
