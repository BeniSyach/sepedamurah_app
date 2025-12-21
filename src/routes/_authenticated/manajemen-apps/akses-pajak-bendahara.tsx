import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AksesPajakBendahara } from '@/features/manajemen-apps/akses-pajak-bendahara'

const UserRoleSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/manajemen-apps/akses-pajak-bendahara'
)({
  validateSearch: UserRoleSearchSchema,
  component: AksesPajakBendahara,
})
