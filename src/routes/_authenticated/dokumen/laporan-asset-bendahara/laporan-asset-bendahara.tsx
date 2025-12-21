import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LaporanAssetBendahara } from '@/features/laporan-asset-bendahara/laporan-dpa'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-asset-bendahara/laporan-asset-bendahara'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: LaporanAssetBendahara,
})
