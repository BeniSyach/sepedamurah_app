import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiPersetujuan } from '@/features/master-data/referensi-persetujuan'

const refpersetujuanSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-persetujuan'
)({
  validateSearch: refpersetujuanSearchSchema,
  component: ReferensiPersetujuan,
})
