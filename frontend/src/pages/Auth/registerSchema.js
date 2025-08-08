/* eslint-disable import/namespace */
import { z } from 'zod'

export const registerSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.email('Please enter a valid email address.'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters.')
    .max(12, 'Password must not exceed 12 characters.'),
  role: z.enum(['ROLE_USER', 'ROLE_TENANT'], { required_error: 'You must select a role.' }),
})
