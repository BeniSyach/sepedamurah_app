export interface DaftarBelanjaSKPD {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nm_opd: string
  jum_belanja: string // jika ingin bisa diubah ke number, nanti parseInt/jika perlu
}

export interface LaporanDaftarBelanjaSKPD {
  data: DaftarBelanjaSKPD[]
}

export interface DetailDaftarBelanjaSKPDItem {
  tanggal: string | null
  sumber_dana: string | null
  jenis_belanja: string | null
  jumlah: number
  tanggal_upload_formatted: string | null
}

export interface DetailDaftarBelanjaSKPDParams {
  tahun: number | string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
}

export interface DetailDaftarBelanjaSKPD {
  status: boolean
  params: DetailDaftarBelanjaSKPDParams
  data: DetailDaftarBelanjaSKPDItem[]
}
