import type { User } from '@/api/auth'
import type { AksesOperator } from '@/api/management-app'
import type { MasterSkpd, RefPajakBendahara } from '@/api/master-data'
import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface LaporanPajakBendaharaResponse {
  data: LaporanPajakBendahara[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface LaporanPajakBendahara {
  id: number

  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string

  tahun: string
  diterima: string
  ditolak: string
  alasan_tolak: string
  proses: string
  supervisor_proses: string
  file: string
  ref_pajak_id: string
  // <--- Tambahkan ini agar tidak error saat backend mengirim accessor
  skpd?: MasterSkpd

  // Relasi
  refPajakBendahara?: RefPajakBendahara | null
  user?: User | null
  operator?: AksesOperator | null

  // Soft delete
  deleted_at?: string | null

  created_at?: string
  updated_at?: string
}
