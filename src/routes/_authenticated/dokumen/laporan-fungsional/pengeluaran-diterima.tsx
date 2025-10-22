import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PengeluaranDiterimaLaporanFungsional } from '@/features/laporan-fungsional/pengeluaran-diterima'

const PengeluaranDiterimaSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/pengeluaran-diterima'
)({
  validateSearch: PengeluaranDiterimaSearchSchema,
  component: PengeluaranDiterimaLaporanFungsional,
})
