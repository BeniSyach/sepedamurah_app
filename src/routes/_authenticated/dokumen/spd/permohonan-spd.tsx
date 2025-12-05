import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanSPD } from '@/features/spd/permohonan-spd'

const PermohonanSPDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort_by: z.string().optional(),
  sort_dir: z.enum(['asc', 'desc']).optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/spd/permohonan-spd'
)({
  validateSearch: PermohonanSPDSearchSchema,
  component: PermohonanSPD,
})
