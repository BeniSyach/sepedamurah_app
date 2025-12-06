// types/analytics.ts

/**
 * Response structure untuk endpoint tableCheckFungsional
 */
export interface TableCheckFungsionalResponse {
  success: boolean
  data: {
    tahun_list: string[]
    tahun_selected: string
    penerimaan: SKPDData[]
    pengeluaran: SKPDData[]
  }
}

/**
 * Data per SKPD dengan status per bulan
 */
export interface SKPDData {
  skpd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  bulan: BulanStatus
}

/**
 * Status per bulan (1-12)
 * true = ada data/terverifikasi
 * false = tidak ada data
 */
export interface BulanStatus {
  '1': boolean
  '2': boolean
  '3': boolean
  '4': boolean
  '5': boolean
  '6': boolean
  '7': boolean
  '8': boolean
  '9': boolean
  '10': boolean
  '11': boolean
  '12': boolean
}

/**
 * Request parameters untuk tableCheckFungsional
 */
export interface TableCheckFungsionalRequest {
  tahun?: string
  kd_opd1?: string
  kd_opd2?: string
  kd_opd3?: string
  kd_opd4?: string
  kd_opd5?: string
}

export interface DashboardResponse {
  status: boolean
  data: DashboardData
}

export interface DashboardData {
  total_permohonan_spd: number
  total_spd_terverifikasi: number
  total_spd_ditolak: number
  total_spd_tte: number

  total_permohonan_sp2d: number
  total_sp2d_terverifikasi: number
  total_sp2d_ditolak: number
  total_sp2d_tte: number
}

export interface SummaryResponse {
  success: boolean
  data: SummaryData
}

export interface SummaryData {
  total_penerimaan: number
  total_pengeluaran: number
  total_pending: number
  total_ditolak: number
  total_penerimaan_verifikasi: number
  total_pengeluaran_verifikasi: number
}

export interface Sp2dChartResponse {
  status: boolean
  tahun: number | string
  chart: Sp2dChartData
  raw: RawSp2dRow[]
}

export interface Sp2dChartData {
  labels: string[] // contoh: ["Jan","Feb","Mar"]
  values: number[] // contoh: [12, 20, 5]
}

export interface RawSp2dRow {
  bulan: string // "01" sampai "12"
  total: number
}
