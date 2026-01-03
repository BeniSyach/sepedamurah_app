import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { LogHapusUsers } from '@/features/history/log-hapus-users'

const LogHapusUsersSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  search: z.string().optional().catch(''),
  tahun: z.coerce.number().optional(),
})

export const Route = createFileRoute('/_authenticated/history/log-hapus-users')(
  {
    validateSearch: LogHapusUsersSearchSchema,
    component: LogHapusUsers,
  }
)
