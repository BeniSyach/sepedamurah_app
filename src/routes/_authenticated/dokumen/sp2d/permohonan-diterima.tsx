import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanDiterimaSP2D } from '@/features/sp2d/permohonan-diterima'

const PermohonanDiterimaSP2DSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/sp2d/permohonan-diterima'
)({
  validateSearch: PermohonanDiterimaSP2DSearchSchema,
  component: PermohonanDiterimaSP2D,
})
