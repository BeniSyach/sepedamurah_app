import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanDitolakSPD } from '@/features/spd/permohonan-ditolak'

const PermohonanDitolakSPDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/spd/permohonan-ditolak'
)({
  validateSearch: PermohonanDitolakSPDSearchSchema,
  component: PermohonanDitolakSPD,
})
