import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiProgram } from '@/features/master-data/referensi-program'

const refProgramSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-program'
)({
  validateSearch: refProgramSearchSchema,
  component: ReferensiProgram,
})
