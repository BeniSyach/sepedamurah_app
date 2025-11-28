import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukSP2D } from '@/features/sp2d/berkas-masuk-sp2d'

const BerkasMasukSP2DSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
  sort_by: z.string().optional(),
  sort_dir: z.enum(['asc', 'desc']).optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/sp2d/berkas-masuk'
)({
  validateSearch: BerkasMasukSP2DSearchSchema,
  component: BerkasMasukSP2D,
})
