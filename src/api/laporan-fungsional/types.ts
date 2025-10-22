import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface LaporanFungsionalResponse {
  data: LaporanFungsional[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface LaporanFungsional {
  id: string
  id_pengirim: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_pengirim: string
  id_operator: string
  nama_operator: string | null
  jenis_berkas: string
  nama_file: string
  nama_file_asli: string
  tanggal_upload: string
  kode_file: string
  tahun: string
  diterima: string | null
  ditolak: string | null
  alasan_tolak: string | null
  proses: string | null
  supervisor_proses: string | null
  berkas_tte: string | null
  date_created: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
