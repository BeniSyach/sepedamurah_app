// types.ts

export interface LaporanRealisasiSumberDana {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  nm_sumber: string
  pagu: number // total pagu
  jumlah_silpa: number // sisa anggaran sebelumnya
  sumber_dana: number // sumber dana aktual
  belanja: number // realisasi belanja
  sisa: number // sisa anggaran
}

export interface LaporanRealisasiSumberDanaResponse {
  data: LaporanRealisasiSumberDana[]
}
