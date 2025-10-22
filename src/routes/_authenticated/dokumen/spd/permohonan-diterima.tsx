import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanDiterimaSPD } from '@/features/spd/permohonan-diterima'

const PermohonanDiterimaSPDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/spd/permohonan-diterima'
)({
  validateSearch: PermohonanDiterimaSPDSearchSchema,
  component: PermohonanDiterimaSPD,
})
