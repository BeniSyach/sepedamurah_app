import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { ReferensiSubKegiatan } from '@/features/master-data/referensi-subkegiatan'

const refSubKegiatanSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/master-data/referensi-subkegiatan'
)({
  validateSearch: refSubKegiatanSearchSchema,
  component: ReferensiSubKegiatan,
})
