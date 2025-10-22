import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Pengembalian } from '@/features/pengembalian'

const PengembalianSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/pengembalian/')({
  validateSearch: PengembalianSearchSchema,
  component: Pengembalian,
})
