import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface Sp2dKirimResponse {
  data: Sp2dData[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface Sp2dData {
  id: string
  tahun: string
  id_berkas: string
  id_penerima: string
  nama_penerima: string
  id_operator: string
  nama_operator: string
  namafile: string
  nama_file_asli: string
  tanggal_upload: string
  keterangan: string
  diterima: string | null
  ditolak: string | null
  tte: string | null
  status: string
  tgl_tte: string
  alasan_tolak: string | null
  tgl_kirim_kebank: string
  id_penandatangan: string
  nama_penandatangan: string
  file_tte: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  publish: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
}
