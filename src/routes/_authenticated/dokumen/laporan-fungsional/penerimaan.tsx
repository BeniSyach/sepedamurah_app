import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PenerimaanLaporanFungsional } from '@/features/laporan-fungsional/penerimaan'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/penerimaan'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: PenerimaanLaporanFungsional,
})
