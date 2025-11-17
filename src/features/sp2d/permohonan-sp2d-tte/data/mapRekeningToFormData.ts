// /* eslint-disable @typescript-eslint/no-explicit-any */
// // src/lib/mapRekeningToFormData.ts
// import type { Sp2dItem } from '@/api'
// export function mapRekeningToFormData(currentRow: Sp2dItem) {
//   if (!currentRow.rekening) return []
//   const urusanMap = new Map<string, any>()
//   currentRow.rekening.forEach((u) => {
//     const urusanKey =
//       u.urusan?.kd_urusan?.trim() || u.urusan?.nm_urusan || 'Tidak Diketahui'
//     const bidangKey = u.bu?.nm_bu ?? 'Tidak Diketahui'
//     const programKey = u.program?.nm_program ?? 'Tidak Diketahui'
//     const kegiatanKey = u.kegiatan?.nm_kegiatan ?? 'Tidak Diketahui'
//     const subKey = u.subkegiatan?.nm_subkegiatan ?? 'Tidak Diketahui'
//     const rekeningKey = u.rekening?.nm_rekening ?? 'Tidak Diketahui'
//     if (!urusanMap.has(urusanKey)) {
//       urusanMap.set(urusanKey, {
//         nm_urusan: u.urusan?.nm_urusan ?? '',
//         bidangUrusan: [],
//       })
//     }
//     const urusan = urusanMap.get(urusanKey)
//     let bidang = urusan.bidangUrusan.find((b: any) => b.nm_bu === bidangKey)
//     if (!bidang) {
//       bidang = { nm_bu: bidangKey, program: [] }
//       urusan.bidangUrusan.push(bidang)
//     }
//     let program = bidang.program.find((p: any) => p.nm_program === programKey)
//     if (!program) {
//       program = { nm_program: programKey, kegiatan: [] }
//       bidang.program.push(program)
//     }
//     let kegiatan = program.kegiatan.find(
//       (k: any) => k.nm_kegiatan === kegiatanKey
//     )
//     if (!kegiatan) {
//       kegiatan = { nm_kegiatan: kegiatanKey, subKegiatan: [] }
//       program.kegiatan.push(kegiatan)
//     }
//     let subKegiatan = kegiatan.subKegiatan.find(
//       (s: any) => s.nm_subkegiatan === subKey
//     )
//     if (!subKegiatan) {
//       subKegiatan = { nm_subkegiatan: subKey, rekening: [] }
//       kegiatan.subKegiatan.push(subKegiatan)
//     }
//     subKegiatan.rekening.push({
//       nm_rekening: rekeningKey,
//       nilai: u.nilai ?? '',
//     })
//   })
//   return Array.from(urusanMap.values())
// }
/* eslint-disable prefer-const */
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

    // ============ URUSAN ============
    if (!urusanMap.has(urusanKey)) {
      urusanMap.set(urusanKey, {
        nm_urusan: u.urusan?.nm_urusan ?? '',
        kd_urusan: u.urusan?.kd_urusan ?? '',
        bidangUrusan: [],
      })
    }

    const urusan = urusanMap.get(urusanKey)

    // ============ BIDANG URUSAN ============
    const kdBuFull = [u.bu?.kd_bu1, u.bu?.kd_bu2].filter(Boolean).join('.')

    let bidang = urusan.bidangUrusan.find((b: any) => b.nm_bu === bidangKey)
    if (!bidang) {
      bidang = {
        nm_bu: bidangKey,
        kd_bu: kdBuFull,
        program: [],
      }
      urusan.bidangUrusan.push(bidang)
    }

    // ============ PROGRAM ============
    const kdProgFull = [
      u.program?.kd_prog1,
      u.program?.kd_prog2,
      u.program?.kd_prog3,
    ]
      .filter(Boolean)
      .join('.')

    let program = bidang.program.find((p: any) => p.nm_program === programKey)
    if (!program) {
      program = {
        nm_program: programKey,
        kd_program: kdProgFull,
        kegiatan: [],
      }
      bidang.program.push(program)
    }

    // ============ KEGIATAN ============
    const kdKegFull = [
      u.kegiatan?.kd_keg1,
      u.kegiatan?.kd_keg2,
      u.kegiatan?.kd_keg3,
      u.kegiatan?.kd_keg4,
      u.kegiatan?.kd_keg5,
    ]
      .filter(Boolean)
      .join('.')

    let kegiatan = program.kegiatan.find(
      (k: any) => k.nm_kegiatan === kegiatanKey
    )
    if (!kegiatan) {
      kegiatan = {
        nm_kegiatan: kegiatanKey,
        kd_kegiatan: kdKegFull,
        subKegiatan: [],
      }
      program.kegiatan.push(kegiatan)
    }

    // ============ SUBKEGIATAN ============
    const kdSubFull = [
      u.subkegiatan?.kd_subkeg1,
      u.subkegiatan?.kd_subkeg2,
      u.subkegiatan?.kd_subkeg3,
      u.subkegiatan?.kd_subkeg4,
      u.subkegiatan?.kd_subkeg5,
      u.subkegiatan?.kd_subkeg6,
    ]
      .filter(Boolean)
      .join('.')

    let subKegiatan = kegiatan.subKegiatan.find(
      (s: any) => s.nm_subkegiatan === subKey
    )
    if (!subKegiatan) {
      subKegiatan = {
        nm_subkegiatan: subKey,
        kd_subkegiatan: kdSubFull,
        rekening: [],
      }
      kegiatan.subKegiatan.push(subKegiatan)
    }

    // ============ REKENING ============
    const kdRekFull = [
      u.rekening?.kd_rekening1,
      u.rekening?.kd_rekening2,
      u.rekening?.kd_rekening3,
      u.rekening?.kd_rekening4,
      u.rekening?.kd_rekening5,
      u.rekening?.kd_rekening6,
    ]
      .filter(Boolean)
      .join('.')

    let existingRekening = subKegiatan.rekening.find(
      (r: any) => r.kd_rekening === kdRekFull
    )

    if (!existingRekening) {
      subKegiatan.rekening.push({
        kd_rekening: kdRekFull, // ✅ simpan kode rekening lengkap
        nm_rekening: rekeningKey, // ✅ nama rekening
        nilai: u.nilai ?? '', // ✅ nilai dari data sumber
      })
    }
  })

  return Array.from(urusanMap.values())
}
