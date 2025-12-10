import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukLaporanDPA } from '@/features/laporan-dpa/berkas-masuk'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-dpa/berkas-masuk'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: BerkasMasukLaporanDPA,
})
