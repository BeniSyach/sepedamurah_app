import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RealisasiBelanja } from '@/features/laporan/realisasi-belanja'

const LaporanRealiasaiBelanjaSearchSchema = z.object({
  search: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
  bulan: z.coerce.number().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/laporan/realisasi-belanja'
)({
  validateSearch: LaporanRealiasaiBelanjaSearchSchema,
  component: RealisasiBelanja,
})
