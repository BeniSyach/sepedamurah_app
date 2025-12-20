// Type untuk satu item RefDPA
export interface RefAssetBendahara {
  id: number // ID
  nm_asset_bendahara: string // Nama DPA
  created_at: string // Timestamp created_at
  updated_at: string // Timestamp updated_at
  deleted_at: string | null // Timestamp deleted_at (nullable)
}

// Type untuk response paginasi
export interface RefAssetBendaharaPaginatedResponse {
  data: RefAssetBendahara[]
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
