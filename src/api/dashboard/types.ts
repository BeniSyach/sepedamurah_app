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

export interface MonitoringItem {
  id: number | null
  kd_opd: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_skpd: string
  dpa_id: number | string
  nama_dpa: string
  status: 'Sudah Upload' | 'Belum Upload'
  tanggal_upload: string | null // ISO date from backend
  proses_status: string
  operator: string | null
  user_id: number | string | null
}

export interface MonitoringSummary {
  total: number
  uploaded: number
  notUploaded: number
  percentage: number
}

export interface MonitoringResponse {
  success: boolean
  data: {
    monitoring: MonitoringItem[]
    summary: MonitoringSummary
    tahun: number
  }
}

export interface AvailableYearsResponse {
  success: boolean
  data: number[] // daftar tahun, contoh: [2025, 2024, 2023]
}

export interface DPATypeItem {
  id: number
  nm_dpa: string
}

export interface DPATypesResponse {
  success: boolean
  data: DPATypeItem[]
}

export interface DPAStatisticItem {
  name: string // nama DPA
  uploaded: number // jumlah sudah upload
  notUploaded: number // jumlah belum upload
  total: number // total SKPD di DPA tersebut
}

export interface DPAStatisticsResponse {
  success: boolean
  data: DPAStatisticItem[]
}
