import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiRekening } from '@/features/master-data/referensi-rekening'

const refRekeningSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-rekening'
)({
  validateSearch: refRekeningSearchSchema,
  component: ReferensiRekening,
})
