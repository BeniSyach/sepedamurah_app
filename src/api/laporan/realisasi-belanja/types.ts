export interface laporanBelanjaData {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  jenis_belanja: string
  belanja_jan: string
  belanja_feb: string
  belanja_mar: string
  belanja_apr: string
  belanja_may: string
  belanja_jun: string
  belanja_jul: string
  belanja_aug: string
  belanja_sep: string
  belanja_oct: string
  belanja_nov: string
  belanja_dec: string
  total_realisasi: number
  total_pagu: number
}

export interface LaporanBelanjaResponse {
  data: laporanBelanjaData[]
}
