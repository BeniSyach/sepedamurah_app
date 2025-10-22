import type { PaginationLinks, PaginationMeta, Users } from '@/api/users'

export interface LogUsersHapusResponse {
  data: LogUsersHapus[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface LogUsersHapus {
  log_id: string
  users_id: string
  deleted_time: string
  deleted_by: string
  alasan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  user: Users
}
