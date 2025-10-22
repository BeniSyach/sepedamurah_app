import { z } from 'zod'

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const refProgramSchema = z.object({
  kd_prog1: z.string(),
  kd_prog2: z.string(),
  kd_prog3: z.string(),
  nm_program: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
})

export type RefProgram = z.infer<typeof refProgramSchema>
