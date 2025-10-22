import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const refUrusanSchema = z.object({
  kd_urusan: z.string(),
  nm_urusan: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
})

export type RefUrusan = z.infer<typeof refUrusanSchema>
