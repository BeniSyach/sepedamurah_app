import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const refSubKegiatanSchema = z.object({
  kd_subkeg1: z.string(),
  kd_subkeg2: z.string(),
  kd_subkeg3: z.string(),
  kd_subkeg4: z.string(),
  kd_subkeg5: z.string(),
  kd_subkeg6: z.string(),
  nm_subkegiatan: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
})

export type RefSubKegiatan = z.infer<typeof refSubKegiatanSchema>
