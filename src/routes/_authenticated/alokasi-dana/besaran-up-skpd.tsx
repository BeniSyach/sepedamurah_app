import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BesaranUPSKPD } from '@/features/alokasi-dana/besaran-up-skpd'

const BesaranUpSKPDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/alokasi-dana/besaran-up-skpd'
)({
  validateSearch: BesaranUpSKPDSearchSchema,
  component: BesaranUPSKPD,
})
