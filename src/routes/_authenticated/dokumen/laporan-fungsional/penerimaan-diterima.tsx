import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PenerimaanDiterimaLaporanFungsional } from '@/features/laporan-fungsional/penerimaan-diterima'

const PenerimaanDiterimaSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/penerimaan-diterima'
)({
  validateSearch: PenerimaanDiterimaSearchSchema,
  component: PenerimaanDiterimaLaporanFungsional,
})
