import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiPajakBendahara } from '@/features/master-data/ref-pajak-bendahara'

const refJenisSpmSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-pajak-bendahara'
)({
  validateSearch: refJenisSpmSearchSchema,
  component: ReferensiPajakBendahara,
})
