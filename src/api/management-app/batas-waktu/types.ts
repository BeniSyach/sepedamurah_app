import { type MasterSkpd } from '@/api/master-data'
import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface BatasWaktuResponse {
  data: BatasWaktu[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface BatasWaktu {
  id: string
  hari: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  waktu_awal: string // contoh: "08:00"
  waktu_akhir: string // contoh: "14:30"
  istirahat_awal: string // contoh: "12:00"
  istirahat_akhir: string // contoh: "13:00"
  keterangan: string
  created_at: string // format: "YYYY-MM-DD HH:mm:ss"
  updated_at: string
  deleted_at: string | null
  skpd: MasterSkpd
}
