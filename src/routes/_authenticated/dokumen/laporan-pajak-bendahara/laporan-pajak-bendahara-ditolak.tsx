import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LaporanPajakBendaharaDitolak } from '@/features/laporan-pajak-bendahara/laporan-dpa-ditolak'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-pajak-bendahara/laporan-pajak-bendahara-ditolak'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: LaporanPajakBendaharaDitolak,
})
