import z from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { SudahParafSPD } from '@/features/spd/sudah-paraf'

const BelumParafSPDSearchSchema = z.object({
  page: z.number().optional().catch(1),
  pageSize: z.number().optional().catch(10),
  nama_pengirim: z.string().optional().catch(''),
})

export const Route = createFileRoute('/_authenticated/dokumen/spd/sudah-paraf')(
  {
    validateSearch: BelumParafSPDSearchSchema,
    component: SudahParafSPD,
  }
)
