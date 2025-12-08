import type { User } from '@/api/auth'
import type { AksesOperator } from '@/api/management-app'

export interface LaporanDPAResponse {
  status: boolean
  data: LaporanDPA[]
}

export interface LaporanDPA {
  id: number
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  tahun: number
  no_dpa: string
  nama_dpa: string

  // Relasi
  dpa?: DPA | null
  user?: User | null
  operator?: AksesOperator | null

  // Soft delete
  deleted_at?: string | null

  created_at?: string
  updated_at?: string
}

export interface DPA {
  id: number
  nama_dpa: string
  tahun: number
}
