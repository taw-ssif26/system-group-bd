import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password too short'),
})

export const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  concernId: z.string().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
})

export const jobApplicationSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  coverLetter: z.string().max(2000).optional(),
  jobId: z.string(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type ContactInput = z.infer<typeof contactSchema>
export type JobApplicationInput = z.infer<typeof jobApplicationSchema>
