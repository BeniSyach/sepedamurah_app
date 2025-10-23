import type { PaginationLinks, PaginationMeta } from '@/api/users'
import { type MasterSkpd } from '../master-data'

export interface BerkasLainResponse {
  success: boolean
  message: string
  data: BerkasLain[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface BerkasLain {
  id: string
  tgl_surat: string
  nama_file_asli: string
  nama_dokumen: string
  status_tte: string
  file_sdh_tte: string
  users_id: string
  user: Users
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface Users {
  id: number
  nik: string
  nip: string
  name: string
  email: string
  no_hp: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  image: string
  is_active: string
  date_created: string | null
  visualisasi_tte: string | null
  deleted: string
  chat_id: string | null
  updated_at: string
  skpd: MasterSkpd
}
