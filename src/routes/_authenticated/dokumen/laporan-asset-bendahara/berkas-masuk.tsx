import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukLaporanAssetBendahara } from '@/features/laporan-asset-bendahara/berkas-masuk'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-asset-bendahara/berkas-masuk'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: BerkasMasukLaporanAssetBendahara,
})
