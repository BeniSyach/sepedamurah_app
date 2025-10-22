import { type User } from '@/api/auth'
import { type MasterSkpd } from '@/api/master-data'
import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface AksesOperatorResponse {
  data: AksesOperator[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface AksesOperator {
  id: string
  id_operator: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  date_created: string // format: "YYYY-MM-DD HH:mm:ss"
  created_at: string
  updated_at: string
  deleted_at: string | null

  user: User
  skpd: MasterSkpd
}
