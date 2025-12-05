import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukSPD } from '@/features/spd/berkas-masuk-spd'

const BerkasMasukSPDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort_by: z.string().optional(),
  sort_dir: z.enum(['asc', 'desc']).optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/spd/berkas-masuk'
)({
  validateSearch: BerkasMasukSPDSearchSchema,
  component: BerkasMasukSPD,
})
