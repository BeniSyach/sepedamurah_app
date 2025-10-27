/* eslint-disable @typescript-eslint/no-explicit-any */
// src/lib/mapRekeningToFormData.ts
import type { Sp2dItem } from '@/api'

export function mapRekeningToFormData(currentRow: Sp2dItem) {
  if (!currentRow.rekening) return []

  const urusanMap = new Map<string, any>()

  currentRow.rekening.forEach((u) => {
    const urusanKey =
      u.urusan?.kd_urusan?.trim() || u.urusan?.nm_urusan || 'Tidak Diketahui'
    const bidangKey = u.bu?.nm_bu ?? 'Tidak Diketahui'
    const programKey = u.program?.nm_program ?? 'Tidak Diketahui'
    const kegiatanKey = u.kegiatan?.nm_kegiatan ?? 'Tidak Diketahui'
    const subKey = u.subkegiatan?.nm_subkegiatan ?? 'Tidak Diketahui'
    const rekeningKey = u.rekening?.nm_rekening ?? 'Tidak Diketahui'

    if (!urusanMap.has(urusanKey)) {
      urusanMap.set(urusanKey, {
        nm_urusan: u.urusan?.nm_urusan ?? '',
        bidangUrusan: [],
      })
    }

    const urusan = urusanMap.get(urusanKey)

    let bidang = urusan.bidangUrusan.find((b: any) => b.nm_bu === bidangKey)
    if (!bidang) {
      bidang = { nm_bu: bidangKey, program: [] }
      urusan.bidangUrusan.push(bidang)
    }

    let program = bidang.program.find((p: any) => p.nm_program === programKey)
    if (!program) {
      program = { nm_program: programKey, kegiatan: [] }
      bidang.program.push(program)
    }

    let kegiatan = program.kegiatan.find(
      (k: any) => k.nm_kegiatan === kegiatanKey
    )
    if (!kegiatan) {
      kegiatan = { nm_kegiatan: kegiatanKey, subKegiatan: [] }
      program.kegiatan.push(kegiatan)
    }

    let subKegiatan = kegiatan.subKegiatan.find(
      (s: any) => s.nm_subkegiatan === subKey
    )
    if (!subKegiatan) {
      subKegiatan = { nm_subkegiatan: subKey, rekening: [] }
      kegiatan.subKegiatan.push(subKegiatan)
    }

    subKegiatan.rekening.push({
      nm_rekening: rekeningKey,
      nilai: u.nilai ?? '',
    })
  })

  return Array.from(urusanMap.values())
}
