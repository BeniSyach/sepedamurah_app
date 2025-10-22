import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface UsersRoleResponse {
  data: UsersRole[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface UsersRole {
  id: string
  rule: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
