// Type untuk satu item RefDPA
export interface RefSp2dbToBUD {
  id: number // ID
  nm_sp2b_ke_bud: string // Nama DPA
  created_at: string // Timestamp created_at
  updated_at: string // Timestamp updated_at
  deleted_at: string | null // Timestamp deleted_at (nullable)
}

// Type untuk response paginasi
export interface RefSp2dbToBUDPaginatedResponse {
  data: RefSp2dbToBUD[]
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    from: number | null
    last_page: number
    path: string
    per_page: number
    to: number | null
    total: number
  }
}
