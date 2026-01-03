import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PengeluaranDitolakLaporanFungsional } from '@/features/laporan-fungsional/pengeluaran-ditolak'

const PengeluaranDitolakSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/pengeluaran-ditolak'
)({
  validateSearch: PengeluaranDitolakSearchSchema,
  component: PengeluaranDitolakLaporanFungsional,
})
