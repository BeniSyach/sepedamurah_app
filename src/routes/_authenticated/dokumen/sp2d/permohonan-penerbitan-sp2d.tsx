import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { PermohonanPenerbitanSP2D } from '@/features/sp2d/permohonan-penerbitan-sp2d'

const PermohonanPenerbitanSP2DSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
  sort_by: z.string().optional(),
  sort_dir: z.enum(['asc', 'desc']).optional(),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/sp2d/permohonan-penerbitan-sp2d'
)({
  validateSearch: PermohonanPenerbitanSP2DSearchSchema,
  component: PermohonanPenerbitanSP2D,
})
