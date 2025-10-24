import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RealisasiBelanja } from '@/features/laporan/realisasi-belanja'

const LaporanRealiasaiBelanjaSearchSchema = z.object({
  tahun: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/laporan/realisasi-belanja'
)({
  validateSearch: LaporanRealiasaiBelanjaSearchSchema,
  component: RealisasiBelanja,
})
