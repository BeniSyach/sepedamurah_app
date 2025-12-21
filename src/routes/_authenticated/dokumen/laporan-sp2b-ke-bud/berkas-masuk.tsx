import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukLaporanSp2bToBUD } from '@/features/laporan-sp2b-to-bud/berkas-masuk'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-sp2b-ke-bud/berkas-masuk'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: BerkasMasukLaporanSp2bToBUD,
})
