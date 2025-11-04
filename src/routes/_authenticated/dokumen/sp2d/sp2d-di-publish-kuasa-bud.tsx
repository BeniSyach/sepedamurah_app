import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { Sp2dPublishKuasaBUD } from '@/features/sp2d/sp2d-publish-kuasa-bud'

const Sp2dPublishKuasaBUDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_file: z.string().optional().catch(''),
})

export const Route = createFileRoute(
  '/_authenticated/dokumen/sp2d/sp2d-di-publish-kuasa-bud'
)({
  validateSearch: Sp2dPublishKuasaBUDSearchSchema,
  component: Sp2dPublishKuasaBUD,
})
