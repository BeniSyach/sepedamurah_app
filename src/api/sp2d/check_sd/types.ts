// types.ts

export interface CheckSumberDana {
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
  jenis_sumber_dana: string
}

export interface CheckSumberDanaResponse {
  data: CheckSumberDana[]
}
