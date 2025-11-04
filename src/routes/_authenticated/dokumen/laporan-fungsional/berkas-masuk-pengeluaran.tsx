import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukPengeluaran } from '@/features/laporan-fungsional/berkas-masuk-pengeluaran'

const BerkasMasukPengeluaranSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-fungsional/berkas-masuk-pengeluaran'
)({
  validateSearch: BerkasMasukPengeluaranSearchSchema,
  component: BerkasMasukPengeluaran,
})
