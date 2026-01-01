import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RealisasiSumberDana } from '@/features/laporan/realisasi-sumber-dana'

const LaporanRealiasaiSumberDanaSearchSchema = z.object({
  tahun: z.coerce.number().optional(),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/laporan/realisasi-sumber-dana'
)({
  validateSearch: LaporanRealiasaiSumberDanaSearchSchema,
  component: RealisasiSumberDana,
})
