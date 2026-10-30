/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'

const formatDate = (date: any) => {
  if (!date) return ''
  return format(new Date(date), 'yyyy-MM-dd')
}

export function buildLaporanPembukuanParams(data: any): URLSearchParams {
  const params = new URLSearchParams()

  if (data.tanggal) {
    params.append('tanggal', formatDate(data.tanggal))
  }

  if (data.range_tanggal?.from) {
    params.append('range_tanggal[from]', formatDate(data.range_tanggal.from))
  }

  if (data.range_tanggal?.to) {
    params.append('range_tanggal[to]', formatDate(data.range_tanggal.to))
  }

  // Urusan
  if (data.urusan) {
    params.append('urusan', data.urusan)
  }
  if (data.nm_urusan) {
    params.append('nm_urusan', data.nm_urusan)
  }

  // Bidang Urusan
  if (data.bidang_urusan?.kd_bu1) {
    params.append('bidang_urusan[kd_bu1]', data.bidang_urusan.kd_bu1)
  }
  if (data.bidang_urusan?.kd_bu2) {
    params.append('bidang_urusan[kd_bu2]', data.bidang_urusan.kd_bu2)
  }
  if (data.bidang_urusan?.nm_bu) {
    params.append('bidang_urusan[nm_bu]', data.bidang_urusan.nm_bu)
  }

  // OPD
  if (data.skpd?.kd_opd1) params.append('skpd[kd_opd1]', data.skpd.kd_opd1)
  if (data.skpd?.kd_opd2) params.append('skpd[kd_opd2]', data.skpd.kd_opd2)
  if (data.skpd?.kd_opd3) params.append('skpd[kd_opd3]', data.skpd.kd_opd3)
  if (data.skpd?.kd_opd4) params.append('skpd[kd_opd4]', data.skpd.kd_opd4)
  if (data.skpd?.kd_opd5) params.append('skpd[kd_opd5]', data.skpd.kd_opd5)
  if (data.skpd?.nm_opd) params.append('skpd[nm_opd]', data.skpd.nm_opd)

  // Program
  if (data.program?.kd_prog1) params.append('program[kd_prog1]', data.program.kd_prog1)
  if (data.program?.kd_prog2) params.append('program[kd_prog2]', data.program.kd_prog2)
  if (data.program?.kd_prog3) params.append('program[kd_prog3]', data.program.kd_prog3)
  if (data.program?.nm_program) params.append('program[nm_program]', data.program.nm_program)

  // Kegiatan
  if (data.kegiatan?.kd_keg1) params.append('kegiatan[kd_keg1]', data.kegiatan.kd_keg1)
  if (data.kegiatan?.kd_keg2) params.append('kegiatan[kd_keg2]', data.kegiatan.kd_keg2)
  if (data.kegiatan?.kd_keg3) params.append('kegiatan[kd_keg3]', data.kegiatan.kd_keg3)
  if (data.kegiatan?.kd_keg4) params.append('kegiatan[kd_keg4]', data.kegiatan.kd_keg4)
  if (data.kegiatan?.kd_keg5) params.append('kegiatan[kd_keg5]', data.kegiatan.kd_keg5)
  if (data.kegiatan?.nm_kegiatan) params.append('kegiatan[nm_kegiatan]', data.kegiatan.nm_kegiatan)

  // Sub Kegiatan
  if (data.subkegiatan?.kd_subkeg1) params.append('subkegiatan[kd_subkeg1]', data.subkegiatan.kd_subkeg1)
  if (data.subkegiatan?.kd_subkeg2) params.append('subkegiatan[kd_subkeg2]', data.subkegiatan.kd_subkeg2)
  if (data.subkegiatan?.kd_subkeg3) params.append('subkegiatan[kd_subkeg3]', data.subkegiatan.kd_subkeg3)
  if (data.subkegiatan?.kd_subkeg4) params.append('subkegiatan[kd_subkeg4]', data.subkegiatan.kd_subkeg4)
  if (data.subkegiatan?.kd_subkeg5) params.append('subkegiatan[kd_subkeg5]', data.subkegiatan.kd_subkeg5)
  if (data.subkegiatan?.kd_subkeg6) params.append('subkegiatan[kd_subkeg6]', data.subkegiatan.kd_subkeg6)
  if (data.subkegiatan?.nm_subkegiatan) params.append('subkegiatan[nm_subkegiatan]', data.subkegiatan.nm_subkegiatan)

  // Sumber Dana
  if (data.sumber_dana?.kd_ref1) params.append('sumber_dana[kd_ref1]', data.sumber_dana.kd_ref1)
  if (data.sumber_dana?.kd_ref2) params.append('sumber_dana[kd_ref2]', data.sumber_dana.kd_ref2)
  if (data.sumber_dana?.kd_ref3) params.append('sumber_dana[kd_ref3]', data.sumber_dana.kd_ref3)
  if (data.sumber_dana?.kd_ref4) params.append('sumber_dana[kd_ref4]', data.sumber_dana.kd_ref4)
  if (data.sumber_dana?.kd_ref5) params.append('sumber_dana[kd_ref5]', data.sumber_dana.kd_ref5)
  if (data.sumber_dana?.kd_ref6) params.append('sumber_dana[kd_ref6]', data.sumber_dana.kd_ref6)

  // Rekening
  if (data.rek_akun) params.append('rek_akun', data.rek_akun)
  if (data.rek_kelompok?.kd_kel1) params.append('rek_kelompok[kd_kel1]', data.rek_kelompok.kd_kel1)
  if (data.rek_kelompok?.kd_kel2) params.append('rek_kelompok[kd_kel2]', data.rek_kelompok.kd_kel2)
  if (data.rek_jenis?.kd_jenis1) params.append('rek_jenis[kd_jenis1]', data.rek_jenis.kd_jenis1)
  if (data.rek_jenis?.kd_jenis2) params.append('rek_jenis[kd_jenis2]', data.rek_jenis.kd_jenis2)
  if (data.rek_jenis?.kd_jenis3) params.append('rek_jenis[kd_jenis3]', data.rek_jenis.kd_jenis3)
  if (data.rek_objek?.kd_objek4) params.append('rek_objek[kd_objek4]', data.rek_objek.kd_objek4)
  if (data.rek_rincian?.kd_rincian5) params.append('rek_rincian[kd_rincian5]', data.rek_rincian.kd_rincian5)
  if (data.sub_rincian?.kd_subrincian6) params.append('sub_rincian[kd_subrincian6]', data.sub_rincian.kd_subrincian6)

  return params
}

async function executePdfDownload(path: string, data: any) {
  const params = buildLaporanPembukuanParams(data)
  const API_URL = import.meta.env.VITE_API_URL
  const token = useAuthStore.getState().accessToken

  const response = await axios.get(`${API_URL}${path}`, {
    params,
    responseType: 'blob',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const url = URL.createObjectURL(response.data)
  window.open(url)
}

export async function downloadLraSumberDanaPdf(data: any) {
  return executePdfDownload('/laporan/pembukuan-lra-sumber-dana/pdf', data)
}

export async function downloadLraUrusanPdf(data: any) {
  return executePdfDownload('/laporan/pembukuan-lra-per-urusan/pdf', data)
}

export async function downloadLraProgramKegiatanPdf(data: any) {
  return executePdfDownload('/laporan/pembukuan-lra-per-program-kegiatan/pdf', data)
}

export async function downloadLraPendapatanBelanjaPdf(data: any) {
  return executePdfDownload('/laporan/pembukuan-lra-pendapatan-belanja/pdf', data)
}

export async function downloadRincianSaldoBukuBesarPdf(data: any) {
  return executePdfDownload('/laporan/pembukuan-rincian-saldo-buku-besar/pdf', data)
}

export async function downloadLraPriodePdf(data: any) {
  return executePdfDownload('/laporan/pembukuan-lra-per-priode/pdf', data)
}
