import { type User } from '@/api/auth'
import { type MasterSkpd } from '@/api/master-data'
import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface AksesKuasaBud {
  id: string
  id_kbud: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  date_created: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  user: User
  skpd: MasterSkpd
}

export interface AksesKuasaBudResponse {
  data: AksesKuasaBud[]
  links: PaginationLinks
  meta: PaginationMeta
}
