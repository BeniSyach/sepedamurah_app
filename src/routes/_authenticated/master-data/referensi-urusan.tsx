import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiUrusan } from '@/features/referensi-urusan'

const refUrusanSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-urusan'
)({
  validateSearch: refUrusanSearchSchema,
  component: ReferensiUrusan,
})
