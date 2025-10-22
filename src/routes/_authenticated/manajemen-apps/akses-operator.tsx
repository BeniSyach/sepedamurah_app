import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AksesOperator } from '@/features/manajemen-apps/akses-operator'

const AksesOperatorSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/manajemen-apps/akses-operator'
)({
  validateSearch: AksesOperatorSearchSchema,
  component: AksesOperator,
})
