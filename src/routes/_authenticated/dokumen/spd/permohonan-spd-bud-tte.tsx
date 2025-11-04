import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanSPDBUDTTE } from '@/features/spd/permohonan-spd-bud-tte'

const PermohonanSPDBUDTTESearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_pengirim: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/spd/permohonan-spd-bud-tte'
)({
  validateSearch: PermohonanSPDBUDTTESearchSchema,
  component: PermohonanSPDBUDTTE,
})
