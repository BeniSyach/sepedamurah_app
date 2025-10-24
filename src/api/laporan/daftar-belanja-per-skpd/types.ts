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
