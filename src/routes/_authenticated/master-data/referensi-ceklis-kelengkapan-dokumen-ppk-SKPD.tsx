import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiCeklisSPM } from '@/features/master-data/referensi-ceklis-kelengkapan-dokumen-ppk-SKPD'

const refKegiatanSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-ceklis-kelengkapan-dokumen-ppk-SKPD'
)({
  validateSearch: refKegiatanSearchSchema,
  component: ReferensiCeklisSPM,
})
