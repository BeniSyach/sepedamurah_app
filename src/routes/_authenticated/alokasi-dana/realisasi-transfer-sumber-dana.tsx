import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RealisasiTransferSumberDana } from '@/features/alokasi-dana/realisasi-transfer-sumber-dana'

const RealisasiTransferSumberDanaSearchSchema = z.object({
  search: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
  bulan: z.coerce.number().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/alokasi-dana/realisasi-transfer-sumber-dana'
)({
  validateSearch: RealisasiTransferSumberDanaSearchSchema,
  component: RealisasiTransferSumberDana,
})
