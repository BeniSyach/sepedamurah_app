import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const refKegiatanSchema = z.object({
  kd_keg1: z.string(),
  kd_keg2: z.string(),
  kd_keg3: z.string(),
  kd_keg4: z.string(),
  kd_keg5: z.string(),
  nm_kegiatan: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
})

export type RefKegiatan = z.infer<typeof refKegiatanSchema>
