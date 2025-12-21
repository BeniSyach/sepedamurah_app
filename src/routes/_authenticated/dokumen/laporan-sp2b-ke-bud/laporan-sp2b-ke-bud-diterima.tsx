import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LaporanSp2bToBUDDiterima } from '@/features/laporan-sp2b-to-bud/laporan-dpa-diterima'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-sp2b-ke-bud/laporan-sp2b-ke-bud-diterima'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: LaporanSp2bToBUDDiterima,
})
