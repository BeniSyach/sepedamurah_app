import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PaguSumberDana } from '@/features/alokasi-dana/pagu-sumber-dana'

const PaguSumberDanaSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/alokasi-dana/pagu-sumber-dana'
)({
  validateSearch: PaguSumberDanaSearchSchema,
  component: PaguSumberDana,
})
