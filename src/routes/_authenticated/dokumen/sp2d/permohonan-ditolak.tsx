import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanDitolakSP2D } from '@/features/sp2d/permohonan-ditolak'

const PermohonanDitolakSP2DSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/sp2d/permohonan-ditolak'
)({
  validateSearch: PermohonanDitolakSP2DSearchSchema,
  component: PermohonanDitolakSP2D,
})
