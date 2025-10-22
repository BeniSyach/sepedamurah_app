import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface Sp2dResponse {
  data: Sp2dItem[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface Sp2dItem {
  id_sp2d: string
  tahun: string
  id_user: string
  nama_user: string
  id_operator: string
  nama_operator: string | null
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_file: string
  nama_file_asli: string
  file_tte: string | null
  tanggal_upload: string
  kode_file: string
  diterima: string | null
  ditolak: string | null
  alasan_tolak: string | null
  proses: string | null
  supervisor_proses: string | null
  urusan: string
  kd_ref1: string | null
  kd_ref2: string | null
  kd_ref3: string | null
  kd_ref4: string | null
  kd_ref5: string | null
  kd_ref6: string | null
  no_spm: string
  jenis_berkas: string
  id_berkas: string
  agreement: string
  kd_belanja1: string | null
  kd_belanja2: string | null
  kd_belanja3: string | null
  jenis_belanja: string | null
  nilai_belanja: string
  status_laporan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
