import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LaporanRekGajiSKPD } from '@/features/laporan-rekonsiliasi-gaji-skpd/laporan-dpa'

const PenerimaanLaporanFungsionalSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/laporan-rekonsiliasi-gaji-skpd/laporan-rekonsiliasi-gaji-skpd'
)({
  validateSearch: PenerimaanLaporanFungsionalSearchSchema,
  component: LaporanRekGajiSKPD,
})
