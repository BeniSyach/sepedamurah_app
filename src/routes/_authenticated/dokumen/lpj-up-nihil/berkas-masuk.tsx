import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasMasukLPJUPNihil } from '@/features/lpj-up-nihil/berkas-masuk'

const BerkasMasukLPJUPNihilSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
  sort_by: z.string().optional(),
  sort_dir: z.enum(['asc', 'desc']).optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/lpj-up-nihil/berkas-masuk'
)({
  validateSearch: BerkasMasukLPJUPNihilSearchSchema,
  component: BerkasMasukLPJUPNihil,
})
