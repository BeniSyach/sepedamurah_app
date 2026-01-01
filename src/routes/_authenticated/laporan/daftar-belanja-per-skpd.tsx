import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { DaftarBelanjaPerSKPD } from '@/features/laporan/daftar-belanja-per-skpd'

const LaporanRealiasaiBelanjaSearchSchema = z.object({
  tahun: z.coerce.number().optional(),
})

export const Route = createFileRoute(
  '/_authenticated/laporan/daftar-belanja-per-skpd'
)({
  validateSearch: LaporanRealiasaiBelanjaSearchSchema,
  component: DaftarBelanjaPerSKPD,
})
