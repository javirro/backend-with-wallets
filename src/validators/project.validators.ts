import { z } from 'zod'

// Example validation schema for test endpoint
export const createUserSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
})

