import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiSp2bToBUD } from '@/features/master-data/ref-sp2b-to-bud'

const refJenisSpmSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-sp2b-to-bud'
)({
  validateSearch: refJenisSpmSearchSchema,
  component: ReferensiSp2bToBUD,
})
