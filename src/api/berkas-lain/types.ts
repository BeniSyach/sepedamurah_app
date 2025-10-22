import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface BerkasLainResponse {
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
  created_at: string
  updated_at: string
  deleted_at: string | null
}
