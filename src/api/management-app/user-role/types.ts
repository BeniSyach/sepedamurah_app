import type { PaginationLinks, PaginationMeta } from '@/api/users'

export interface UsersRoleResponse {
  data: UsersRole[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface UsersRole {
  rn: string
  id: string
  rule: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  menus: UsersRoleMenu[] // relasi ke menu
}

export interface UsersRoleMenu {
  id: string
  role_id: string
  menu: string
}
