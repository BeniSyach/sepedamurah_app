import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanSPD } from '@/features/spd/permohonan-spd'

const PermohonanSPDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_pengirim: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/spd/permohonan-spd'
)({
  validateSearch: PermohonanSPDSearchSchema,
  component: PermohonanSPD,
})
