import { type MasterSkpd } from '../master-data'

export interface ProfileResponse {
  id: string
  name: string
  email: string
  role: string
}

export interface Menu {
  id: string
  role_id?: string
  menu: string
}

export interface RuleUsers {
  id: string
  rule: string
  menus: Menu[]
}

export interface Users {
  id: string
  nik: string
  nip: string
  name: string
  email: string
  no_hp: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  image: string | null
  is_active: boolean | string
  visualisasi_tte: string | null
  chat_id: string | null
  date_created: string | null
  updated_at?: string | null
  deleted?: string | null
  skpd: MasterSkpd
  rules: RuleUsers[]
  access_level: string
}

export interface PaginationLink {
  url: string | null
  label: string
  active: boolean
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number | null
  total: number
}

export interface UsersResponse {
  data: Users[]
  links: PaginationLinks
  meta: PaginationMeta
}
