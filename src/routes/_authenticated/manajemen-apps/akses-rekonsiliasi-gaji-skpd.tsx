import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { AksesRekGajiSKPD } from '@/features/manajemen-apps/akses-rekonsiliasi-gaji-skpd'

const UserRoleSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/manajemen-apps/akses-rekonsiliasi-gaji-skpd'
)({
  validateSearch: UserRoleSearchSchema,
  component: AksesRekGajiSKPD,
})
