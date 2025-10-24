import type { PaginationLinks, PaginationMeta } from '@/api/users'
import { type MasterSkpd } from '../master-data'

export interface PengembalianResponse {
  data: Pengembalian[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface Pengembalian {
  no_sts: string
  nik: string
  nama: string
  alamat: string
  tahun: string
  kd_rek1: string
  kd_rek2: string
  kd_rek3: string
  kd_rek4: string
  kd_rek5: string
  kd_rek6: string
  nm_rekening: string
  keterangan: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  jml_pengembalian: string
  tgl_rekam: string
  jml_yg_disetor: string | null
  tgl_setor: string
  nip_perekam: string
  kode_pengesahan: string
  kode_cabang: string
  nama_channel: string
  status_pembayaran_pajak: string
  status_bayar: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  skpd: MasterSkpd
}
