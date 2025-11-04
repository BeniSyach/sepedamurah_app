import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiKegiatan } from '@/features/master-data/referensi-kegiatan'

const refKegiatanSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nm_kegiatan: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-kegiatan'
)({
  validateSearch: refKegiatanSearchSchema,
  component: ReferensiKegiatan,
})
