import { type User } from '@/api/auth'
import { type MasterSkpd } from '@/api/master-data'
import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface PermohonanSpdResponse {
  data: PermohonanSpd[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface PermohonanSpd {
  id: string
  id_pengirim: string
  nama_pengirim: string
  id_operator: string
  nama_operator: string | null
  jenis_berkas: string | null
  nama_file: string
  nama_file_asli: string
  tanggal_upload: string
  kode_file: string
  diterima: string | null
  ditolak: string | null
  alasan_tolak: string | null
  proses: string | null
  supervisor_proses: string | null
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  date_created: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  pengirim: User
  operator: User
  skpd: MasterSkpd
}
