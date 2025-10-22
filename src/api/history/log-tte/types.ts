import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface LogTTEResponse {
  data: LogTTE[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface LogTTE {
  id: string
  id_berkas: string
  kategori: string
  tte: string
  status: string
  tgl_tte: string
  keterangan: string
  message: string
  id_penandatangan: string
  nama_penandatangan: string
  date_created: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
