/* eslint-disable import/namespace */
import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(6).max(12),
})
