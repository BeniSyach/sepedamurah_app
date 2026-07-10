/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios'
import { format } from 'date-fns'
import { useAuthStore } from '@/stores/auth-store'

const formatDate = (date: any) => {
  return format(new Date(date), 'yyyy-MM-dd')
}

export async function downloadLraSumberDanaPdf(data: any) {
  const params = new URLSearchParams()

  params.append('tanggal', formatDate(data.tanggal))

  params.append('range_tanggal[from]', formatDate(data.range_tanggal.from))

  if (data.range_tanggal.to) {
    params.append('range_tanggal[to]', formatDate(data.range_tanggal.to))
  }

  // ========================
  // Urusan
  // ========================

  params.append('urusan', data.urusan ?? '')

  // ========================
  // Bidang Urusan
  // ========================

  params.append('bidang_urusan[kd_bu1]', data.bidang_urusan?.kd_bu1 ?? '')

  params.append('bidang_urusan[kd_bu2]', data.bidang_urusan?.kd_bu2 ?? '')

  // ========================
  // OPD
  // ========================

  params.append('skpd[kd_opd1]', data.skpd?.kd_opd1 ?? '')
  params.append('skpd[kd_opd2]', data.skpd?.kd_opd2 ?? '')
  params.append('skpd[kd_opd3]', data.skpd?.kd_opd3 ?? '')
  params.append('skpd[kd_opd4]', data.skpd?.kd_opd4 ?? '')
  params.append('skpd[kd_opd5]', data.skpd?.kd_opd5 ?? '')

  // ========================
  // Program
  // ========================

  params.append('program[kd_prog1]', data.program?.kd_prog1 ?? '')
  params.append('program[kd_prog2]', data.program?.kd_prog2 ?? '')
  params.append('program[kd_prog3]', data.program?.kd_prog3 ?? '')

  // ========================
  // Kegiatan
  // ========================

  params.append('kegiatan[kd_keg1]', data.kegiatan?.kd_keg1 ?? '')
  params.append('kegiatan[kd_keg2]', data.kegiatan?.kd_keg2 ?? '')
  params.append('kegiatan[kd_keg3]', data.kegiatan?.kd_keg3 ?? '')
  params.append('kegiatan[kd_keg4]', data.kegiatan?.kd_keg4 ?? '')
  params.append('kegiatan[kd_keg5]', data.kegiatan?.kd_keg5 ?? '')

  // ========================
  // Sub Kegiatan
  // ========================

  params.append('subkegiatan[kd_subkeg1]', data.subkegiatan?.kd_subkeg1 ?? '')

  params.append('subkegiatan[kd_subkeg2]', data.subkegiatan?.kd_subkeg2 ?? '')

  params.append('subkegiatan[kd_subkeg3]', data.subkegiatan?.kd_subkeg3 ?? '')

  params.append('subkegiatan[kd_subkeg4]', data.subkegiatan?.kd_subkeg4 ?? '')

  params.append('subkegiatan[kd_subkeg5]', data.subkegiatan?.kd_subkeg5 ?? '')

  params.append('subkegiatan[kd_subkeg6]', data.subkegiatan?.kd_subkeg6 ?? '')

  // ========================
  // Sumber Dana
  // ========================

  params.append('sumber_dana[kd_ref1]', data.sumber_dana?.kd_ref1 ?? '')

  params.append('sumber_dana[kd_ref2]', data.sumber_dana?.kd_ref2 ?? '')

  params.append('sumber_dana[kd_ref3]', data.sumber_dana?.kd_ref3 ?? '')

  params.append('sumber_dana[kd_ref4]', data.sumber_dana?.kd_ref4 ?? '')

  params.append('sumber_dana[kd_ref5]', data.sumber_dana?.kd_ref5 ?? '')

  params.append('sumber_dana[kd_ref6]', data.sumber_dana?.kd_ref6 ?? '')

  // ========================
  // Rekening
  // ========================

  params.append('rek_akun', data.rek_akun ?? '')

  params.append('rek_kelompok[kd_kel1]', data.rek_kelompok?.kd_kel1 ?? '')

  params.append('rek_kelompok[kd_kel2]', data.rek_kelompok?.kd_kel2 ?? '')

  params.append('rek_jenis[kd_jenis1]', data.rek_jenis?.kd_jenis1 ?? '')

  params.append('rek_jenis[kd_jenis2]', data.rek_jenis?.kd_jenis2 ?? '')

  params.append('rek_jenis[kd_jenis3]', data.rek_jenis?.kd_jenis3 ?? '')

  params.append('rek_objek[kd_objek4]', data.rek_objek?.kd_objek4 ?? '')

  params.append('rek_rincian[kd_rincian5]', data.rek_rincian?.kd_rincian5 ?? '')

  params.append(
    'sub_rincian[kd_subrincian6]',
    data.sub_rincian?.kd_subrincian6 ?? ''
  )
  const API_URL = import.meta.env.VITE_API_URL
  const token = useAuthStore.getState().accessToken
  const response = await axios.get(
    `${API_URL}/laporan/pembukuan-lra-sumber-dana/pdf`,
    {
      params,
      responseType: 'blob',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )

  const url = URL.createObjectURL(response.data)

  window.open(url)
}
