import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukPenerimaan } from '@/features/laporan-fungsional/berkas-masuk-penerimaan'

const BerkasMasukPenerimaanSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/berkas-masuk-penerimaan'
)({
  validateSearch: BerkasMasukPenerimaanSearchSchema,
  component: BerkasMasukPenerimaan,
})
