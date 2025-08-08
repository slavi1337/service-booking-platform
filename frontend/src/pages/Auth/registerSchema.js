/* eslint-disable import/namespace */
import { z } from 'zod'

const userSchema = z.object({
  role: z.literal('ROLE_USER'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
})

const tenantSchema = z.object({
  role: z.literal('ROLE_TENANT'),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  businessName: z.string().min(2, 'Business name is required.'),
  businessDescription: z.string().optional(),
})

export const registerSchema = z.discriminatedUnion('role', [userSchema, tenantSchema]).and(
  z.object({
    email: z.email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
  }),
)
