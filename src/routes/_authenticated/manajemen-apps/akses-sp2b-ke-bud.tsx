import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AksesSp2bToBUD } from '@/features/manajemen-apps/akses-sp2b-to-bud'

const UserRoleSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/manajemen-apps/akses-sp2b-ke-bud'
)({
  validateSearch: UserRoleSearchSchema,
  component: AksesSp2bToBUD,
})
