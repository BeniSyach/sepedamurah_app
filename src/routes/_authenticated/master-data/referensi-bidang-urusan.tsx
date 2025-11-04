import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiBidangUrusan } from '@/features/referensi-bidang-urusan'

const refBidangUrusanSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nm_bu: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-bidang-urusan'
)({
  validateSearch: refBidangUrusanSearchSchema,
  component: ReferensiBidangUrusan,
})
