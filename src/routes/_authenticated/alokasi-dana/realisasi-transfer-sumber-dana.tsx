import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { RealisasiTransferSumberDana } from '@/features/alokasi-dana/realisasi-transfer-sumber-dana'

const RealisasiTransferSumberDanaSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/alokasi-dana/realisasi-transfer-sumber-dana'
)({
  validateSearch: RealisasiTransferSumberDanaSearchSchema,
  component: RealisasiTransferSumberDana,
})
