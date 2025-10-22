import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiSumberDana } from '@/features/master-data/referensi-sumber-dana'

const refSumberDanaSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-sumber-dana'
)({
  validateSearch: refSumberDanaSearchSchema,
  component: ReferensiSumberDana,
})
