import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiPaguBelanja } from '@/features/master-data/referensi-pagu-belanja'

const refPaguBelanjaSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  sort_by: z.string().optional().catch(''),
  sort_dir: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-pagu-belanja'
)({
  validateSearch: refPaguBelanjaSearchSchema,
  component: ReferensiPaguBelanja,
})
