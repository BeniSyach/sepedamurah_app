import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LaporanAssetBendaharaDiterima } from '@/features/laporan-asset-bendahara/laporan-dpa-diterima'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-asset-bendahara/laporan-asset-bendahara-diterima'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: LaporanAssetBendaharaDiterima,
})
