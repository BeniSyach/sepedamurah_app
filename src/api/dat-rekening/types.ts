// Tipe untuk satu data rekening
export interface DatRekeningItem {
  rn: string
  tahun_rek: string
  kd_rek1: string
  kd_rek2: string
  kd_rek3: string
  kd_rek4: string
  kd_rek5: string | null
  kd_rek6: string | null
  nm_rekening: string
  status_rek: string
}

// Tipe untuk response pagination
export interface PaginatedDatRekening {
  current_page: number
  data: DatRekeningItem[]
  first_page_url: string | null
  from: number | null
  last_page: number
  last_page_url: string | null
  links: {
    url: string | null
    label: string
    active: boolean
  }[]
  next_page_url: string | null
  path: string
  per_page: number
  prev_page_url: string | null
  to: number | null
  total: number
}
