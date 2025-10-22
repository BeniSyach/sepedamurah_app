import { z } from 'zod'

export const refRekeningSchema = z.object({
  kd_rekening1: z.string(),
  kd_rekening2: z.string(),
  kd_rekening3: z.string(),
  kd_rekening4: z.string(),
  kd_rekening5: z.string(),
  kd_rekening6: z.string(),
  nm_rekening: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
})
export type Rekening = z.infer<typeof refRekeningSchema>

export const RekeningListSchema = z.array(refRekeningSchema)
