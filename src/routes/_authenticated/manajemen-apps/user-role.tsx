import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { UserRole } from '@/features/manajemen-apps/user-role'

const UserRoleSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/manajemen-apps/user-role'
)({
  validateSearch: UserRoleSearchSchema,
  component: UserRole,
})
