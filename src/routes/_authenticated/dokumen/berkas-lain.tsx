import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { BerkasLainLain } from '@/features/berkas-lain'

const BerkasLainSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/dokumen/berkas-lain')({
  validateSearch: BerkasLainSearchSchema,
  component: BerkasLainLain,
})
