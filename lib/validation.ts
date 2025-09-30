import { z } from 'zod'

export const createUploadSchema = z.object({
  userId: z.string().min(1, 'User ID is required').max(255, 'User ID too long'),
  imageUrl: z.string().url('Invalid image URL').max(1000, 'Image URL too long'),
})

export const updateUploadSchema = createUploadSchema.partial()

export const createAiResultSchema = z.object({
  id: z.string().uuid('Invalid upload ID'),
  aiQuestion: z
    .string()
    .min(1, 'AI question is required')
    .max(10000, 'Question too long'),
  aiSolution: z
    .string()
    .min(1, 'AI solution is required')
    .max(50000, 'Solution too long'),
})

export const uuidSchema = z.string().uuid('Invalid ID format')

export type CreateUploadInput = z.infer<typeof createUploadSchema>
export type UpdateUploadInput = z.infer<typeof updateUploadSchema>
export type CreateAiResultInput = z.infer<typeof createAiResultSchema>
