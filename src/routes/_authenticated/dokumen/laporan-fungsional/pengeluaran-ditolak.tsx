import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PengeluaranDitolakLaporanFungsional } from '@/features/laporan-fungsional/pengeluaran-ditolak'

const PengeluaranDitolakSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/pengeluaran-ditolak'
)({
  validateSearch: PengeluaranDitolakSearchSchema,
  component: PengeluaranDitolakLaporanFungsional,
})
