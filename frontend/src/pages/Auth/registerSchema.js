import { z } from 'zod'

const MAX_FILE_SIZE = 5000000
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

const userSchema = z.object({
  role: z.literal('ROLE_USER'),
  firstName: z.string().min(1, 'First name is required.'),
  lastName: z.string().min(1, 'Last name is required.'),
})

const tenantSchema = z.object({
  role: z.literal('ROLE_TENANT'),
  businessName: z.string().min(1, 'Business name is required.'),
  businessDescription: z.string().optional(),
  image: z
    .any()
    .refine((files) => files?.length > 0, 'Image is required.')
    .refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
    .refine(
      (files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      '.jpg, .jpeg, .png and .webp files are accepted.',
    ),
})

export const registerSchema = z.discriminatedUnion('role', [userSchema, tenantSchema]).and(
  z.object({
    email: z.string().email('Please enter a valid email address.'),
    password: z.string().min(6, 'Password must be at least 6 characters.'),
  }),
)
