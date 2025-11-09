import { type MasterSkpd } from '@/api/master-data'
import type { PaginationLinks, PaginationMeta } from '@/api/users'
import { type PermohonanSpd } from '../permohonan-spd'

export interface SpdTerkirimResponse {
  data: SpdTerkirim[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface SpdTerkirim {
  id: string
  id_berkas: string | null
  id_penerima: string
  nama_penerima: string
  id_operator: string
  nama_operator: string
  namafile: string
  nama_file_asli: string
  nama_file_lampiran: string | null
  tanggal_upload: string
  keterangan: string
  paraf_kbud: string
  tgl_paraf: string
  tte: string
  passpharase: string | null
  status: string
  tgl_tte: string
  id_penandatangan: string
  nama_penandatangan: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  file_tte: string
  publish: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  skpd: MasterSkpd
  permohonan: PermohonanSpd
}
