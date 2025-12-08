import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AksesDPASKPD } from '@/features/manajemen-apps/akses-dpa-skpd'

const UserRoleSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/manajemen-apps/akses-dpa-skpd'
)({
  validateSearch: UserRoleSearchSchema,
  component: AksesDPASKPD,
})
