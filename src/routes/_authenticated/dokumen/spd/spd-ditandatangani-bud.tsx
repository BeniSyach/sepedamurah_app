import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SpdDitandatanganiBUD } from '@/features/spd/spd-ditandatangani-bud'

const SpdDitandatanganiBUDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/spd/spd-ditandatangani-bud'
)({
  validateSearch: SpdDitandatanganiBUDSearchSchema,
  component: SpdDitandatanganiBUD,
})
