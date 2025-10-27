import type { PaginationLinks, PaginationMeta } from '@/api/users'
import { type Sp2dData } from '../sp2d-kirim'

export interface Sp2dResponse {
  success: boolean
  message: string
  data: Sp2dItem[]
  meta: PaginationMeta
  links: PaginationLinks
}

export interface Sp2dItem {
  rn: string
  id_sp2d: string
  tahun: string
  id_user: string
  nama_user: string
  id_operator: string
  nama_operator: string | null
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nama_file: string
  nama_file_asli: string
  file_tte: string | null
  tanggal_upload: string
  kode_file: string
  diterima: string | null
  ditolak: string | null
  alasan_tolak: string | null
  deleted: string | null
  proses: string | null
  supervisor_proses: string | null
  urusan: string
  kd_ref1: string | null
  kd_ref2: string | null
  kd_ref3: string | null
  kd_ref4: string | null
  kd_ref5: string | null
  kd_ref6: string | null
  no_spm: string
  jenis_berkas: string
  id_berkas: string
  agreement: string
  kd_belanja1: string | null
  kd_belanja2: string | null
  kd_belanja3: string | null
  jenis_belanja: string | null
  nilai_belanja: string
  date_created: string
  status_laporan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  program: Program | null
  kegiatan: Kegiatan | null
  subkegiatan: SubKegiatan | null
  rekening: RekeningItem[]
  bu: Bu | null
  skpd: Skpd
  sumber_dana: SumberDanaItem[]
  sp2dkirim: Sp2dData[]
}

// ==============================
// NESTED OBJECT TYPES
// ==============================

interface Urusan {
  kd_urusan: string
  nm_urusan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface Bu {
  kd_bu1: string
  kd_bu2: string
  nm_bu: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface Program {
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
  nm_program: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface Kegiatan {
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
  nm_kegiatan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface SubKegiatan {
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
  nm_subkegiatan: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface RekeningRef {
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string
  nm_rekening: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface RekeningItem {
  id: number
  sp2d_id: string
  kd_rekening1: string
  kd_rekening2: string
  kd_rekening3: string
  kd_rekening4: string
  kd_rekening5: string
  kd_rekening6: string
  nilai: string
  kd_keg1: string
  kd_keg2: string
  kd_keg3: string
  kd_keg4: string
  kd_keg5: string
  kd_subkeg1: string
  kd_subkeg2: string
  kd_subkeg3: string
  kd_subkeg4: string
  kd_subkeg5: string
  kd_subkeg6: string
  kd_prog1: string
  kd_prog2: string
  kd_prog3: string
  kd_urusan: string
  kd_bu1: string
  kd_bu2: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  program: Program | null
  kegiatan: Kegiatan | null
  subkegiatan: SubKegiatan | null
  rekening: RekeningRef
  bu: Bu
  urusan: Urusan
}

interface Skpd {
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  nm_opd: string
  status_penerimaan: number
  kode_opd: string
  hidden: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface SumberDanaItem {
  id: number
  sp2d_id: string
  kd_ref1: string | null
  kd_ref2: string | null
  kd_ref3: string | null
  kd_ref4: string | null
  kd_ref5: string | null
  kd_ref6: string | null
  nilai: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  referensi: Referensi | null
}

interface Referensi {
  kd_ref1: string
  kd_ref2: string
  kd_ref3: string
  kd_ref4: string
  kd_ref5: string
  kd_ref6: string
  nm_ref: string
  status: number
  created_at: string
  updated_at: string
  deleted_at: string | null
}
