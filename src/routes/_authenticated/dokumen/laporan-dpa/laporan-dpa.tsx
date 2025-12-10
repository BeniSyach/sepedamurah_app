import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LaporanDPA } from '@/features/laporan-dpa/laporan-dpa'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-dpa/laporan-dpa'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: LaporanDPA,
})
