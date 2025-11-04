import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PengeluaranLaporanFungsional } from '@/features/laporan-fungsional/pengeluaran'

const PengeluaranLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/pengeluaran'
)({
  validateSearch: PengeluaranLaporanFungsionalSearchSchema,
  component: PengeluaranLaporanFungsional,
})
