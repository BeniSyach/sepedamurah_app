import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukLaporanPajakBendahara } from '@/features/laporan-pajak-bendahara/berkas-masuk'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-pajak-bendahara/berkas-masuk'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: BerkasMasukLaporanPajakBendahara,
})
