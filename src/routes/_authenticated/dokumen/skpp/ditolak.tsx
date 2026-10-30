import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SkppDitolakPage } from '@/features/skpp/skpp-ditolak'

const SkppDitolakSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  status: z.string().optional().catch('Ditolak'),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/skpp/ditolak'
)({
  validateSearch: SkppDitolakSearchSchema,
  component: SkppDitolakPage,
})
