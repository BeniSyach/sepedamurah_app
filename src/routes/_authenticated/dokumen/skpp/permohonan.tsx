import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SkppPage } from '@/features/skpp'

const SkppSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  status: z.string().optional().catch('all'),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/skpp/permohonan'
)({
  validateSearch: SkppSearchSchema,
  component: SkppPage,
})
