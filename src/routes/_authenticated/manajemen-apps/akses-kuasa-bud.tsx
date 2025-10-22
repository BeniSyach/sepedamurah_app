import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AksesKuasaBUD } from '@/features/manajemen-apps/akses-kuasa-bud'

const AksesKuasaBUDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/manajemen-apps/akses-kuasa-bud'
)({
  validateSearch: AksesKuasaBUDSearchSchema,
  component: AksesKuasaBUD,
})
