import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiJenisSPM } from '@/features/master-data/referensi-jenis-spm'

const refJenisSpmSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-jenis-spm'
)({
  validateSearch: refJenisSpmSearchSchema,
  component: ReferensiJenisSPM,
})
