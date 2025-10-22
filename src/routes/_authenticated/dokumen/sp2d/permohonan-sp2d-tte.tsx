import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanSp2dTTE } from '@/features/sp2d/permohonan-sp2d-tte'

const PermohonanSp2dTTESearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/sp2d/permohonan-sp2d-tte'
)({
  validateSearch: PermohonanSp2dTTESearchSchema,
  component: PermohonanSp2dTTE,
})
