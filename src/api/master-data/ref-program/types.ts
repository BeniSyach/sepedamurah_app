import { type PaginationLink } from '@/api/users'

export interface Program {
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
  nm_program: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface ProgramLinks {
  first: string
  last: string
  prev: string | null
  next: string | null
}

interface ProgramMeta {
  current_page: number
  from: number
  last_page: number
  links: PaginationLink[]
  path: string
  per_page: number
  to: number
  total: number
}

export interface ProgramResponse {
  data: Program[]
  links: ProgramLinks
  meta: ProgramMeta
}
