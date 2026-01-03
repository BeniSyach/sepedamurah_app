import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LaporanAssetBendaharaDitolak } from '@/features/laporan-asset-bendahara/laporan-dpa-ditolak'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-asset-bendahara/laporan-asset-bendahara-ditolak'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: LaporanAssetBendaharaDitolak,
})
