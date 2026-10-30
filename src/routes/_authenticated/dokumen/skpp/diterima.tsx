import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SkppDiterimaPage } from '@/features/skpp/skpp-diterima'

const SkppDiterimaSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  status: z.string().optional().catch('Diterima'),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/skpp/diterima'
)({
  validateSearch: SkppDiterimaSearchSchema,
  component: SkppDiterimaPage,
})
