import { db } from '@/lib/db'
import {
  userUploads,
  aiProcessingResults,
  type UserUpload,
  type NewUserUpload,
  type AiProcessingResult,
  type NewAiProcessingResult,
} from '@/lib/schema'
import { eq, desc, and } from 'drizzle-orm'
import { auth } from '@clerk/nextjs/server'

/**
 * Internal database operations - Server-side only
 * Route-level protection is handled by middleware.ts
 * These functions handle user identification and data isolation
 */

async function getCurrentUserId(): Promise<string> {
  const { userId } = await auth()
  // Middleware ensures user is authenticated, but we still check for safety
  if (!userId) {
    throw new Error('User session not found')
  }
  return userId
}

// User Uploads CRUD Operations
export async function createUpload(data: Omit<NewUserUpload, 'userId'>): Promise<UserUpload> {
  const userId = await getCurrentUserId()

  const [newUpload] = await db
    .insert(userUploads)
    .values({ ...data, userId })
    .returning()

  return newUpload
}

export async function getUserUploads(): Promise<UserUpload[]> {
  const userId = await getCurrentUserId()

  const uploads = await db
    .select()
    .from(userUploads)
    .where(eq(userUploads.userId, userId))
    .orderBy(desc(userUploads.createdAt))

  return uploads
}

export async function getUploadById(id: string): Promise<UserUpload | null> {
  const userId = await getCurrentUserId()

  const [upload] = await db
    .select()
    .from(userUploads)
    .where(and(eq(userUploads.id, id), eq(userUploads.userId, userId)))

  return upload || null
}

export async function updateUpload(
  id: string,
  data: Partial<Omit<UserUpload, 'id' | 'userId' | 'createdAt'>>,
): Promise<UserUpload | null> {
  const userId = await getCurrentUserId()

  const [updatedUpload] = await db
    .update(userUploads)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(userUploads.id, id), eq(userUploads.userId, userId)))
    .returning()

  return updatedUpload || null
}

export async function deleteUpload(id: string): Promise<boolean> {
  const userId = await getCurrentUserId()

  const [deletedUpload] = await db
    .delete(userUploads)
    .where(and(eq(userUploads.id, id), eq(userUploads.userId, userId)))
    .returning()

  return !!deletedUpload
}

// AI Processing Results CRUD Operations
export async function createAiResult(data: NewAiProcessingResult): Promise<AiProcessingResult> {
  await getCurrentUserId() // Verify user session

  // Verify the upload belongs to the current user
  const upload = await getUploadById(data.id)
  if (!upload) {
    throw new Error('Upload not found or access denied')
  }

  const [newResult] = await db.insert(aiProcessingResults).values(data).returning()

  return newResult
}

export async function getUserAiResults(): Promise<AiProcessingResult[]> {
  const userId = await getCurrentUserId()

  const results = await db
    .select({
      id: aiProcessingResults.id,
      aiQuestion: aiProcessingResults.aiQuestion,
      aiSolution: aiProcessingResults.aiSolution,
      createdAt: aiProcessingResults.createdAt,
      updatedAt: aiProcessingResults.updatedAt,
    })
    .from(aiProcessingResults)
    .leftJoin(userUploads, eq(aiProcessingResults.id, userUploads.id))
    .where(eq(userUploads.userId, userId))
    .orderBy(desc(aiProcessingResults.createdAt))

  return results
}

export async function getAiResultById(id: string): Promise<AiProcessingResult | null> {
  const userId = await getCurrentUserId()

  const [result] = await db
    .select({
      id: aiProcessingResults.id,
      aiQuestion: aiProcessingResults.aiQuestion,
      aiSolution: aiProcessingResults.aiSolution,
      createdAt: aiProcessingResults.createdAt,
      updatedAt: aiProcessingResults.updatedAt,
    })
    .from(aiProcessingResults)
    .leftJoin(userUploads, eq(aiProcessingResults.id, userUploads.id))
    .where(and(eq(aiProcessingResults.id, id), eq(userUploads.userId, userId)))

  return result || null
}

// Combined operations for convenience
export async function getUploadWithAiResult(id: string) {
  const userId = await getCurrentUserId()

  const [result] = await db
    .select()
    .from(userUploads)
    .leftJoin(aiProcessingResults, eq(userUploads.id, aiProcessingResults.id))
    .where(and(eq(userUploads.id, id), eq(userUploads.userId, userId)))

  return result || null
}

export async function getAllUserDataWithResults() {
  const userId = await getCurrentUserId()

  const results = await db
    .select()
    .from(userUploads)
    .leftJoin(aiProcessingResults, eq(userUploads.id, aiProcessingResults.id))
    .where(eq(userUploads.userId, userId))
    .orderBy(desc(userUploads.createdAt))

  return results
}
