import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const refBidangUrusanSchema = z.object({
  kd_bu1: z.string(),
  kd_bu2: z.string(),
  nm_bu: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
})

export type RefBidangUrusan = z.infer<typeof refBidangUrusanSchema>
