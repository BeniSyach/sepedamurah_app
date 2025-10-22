import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PenerimaanDitolakLaporanFungsional } from '@/features/laporan-fungsional/penerimaan-ditolak'

const PenerimaanDitolakSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/penerimaan-ditolak'
)({
  validateSearch: PenerimaanDitolakSearchSchema,
  component: PenerimaanDitolakLaporanFungsional,
})
