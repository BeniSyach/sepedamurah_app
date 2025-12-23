import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RealisasiBelanjaSKPD } from '@/features/laporan/realisasi-belanja-opd'

const LaporanRealiasaiBelanjaSearchSchema = z.object({
  search: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
  bulan: z.coerce.number().optional(),
  kd_opd1: z.string().optional().catch(''),
  kd_opd2: z.string().optional().catch(''),
  kd_opd3: z.string().optional().catch(''),
  kd_opd4: z.string().optional().catch(''),
  kd_opd5: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/laporan/realisasi-belanja-opd'
)({
  validateSearch: LaporanRealiasaiBelanjaSearchSchema,
  component: RealisasiBelanjaSKPD,
})
