import { db } from '@/lib/db'
import {
  userUploads,
  aiProcessingResults,
  errorLibrary,
  type UserUpload,
  type AiProcessingResult,
  type NewAiProcessingResult,
  type ErrorLibrary,
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
/**
 * 创建上传记录
 * @param imageUrl - 图片 URL（userId 会从当前会话自动获取）
 */
export async function createUpload(imageUrl: string): Promise<UserUpload> {
  // 强制从当前会话获取 userId，确保安全性
  const userId = await getCurrentUserId()

  const [newUpload] = await db.insert(userUploads).values({ imageUrl, userId }).returning()

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

// Error Library CRUD Operations
/**
 * 创建错题库记录
 * @param data - 包含题目、解答和 uploadId（userId 会从当前会话自动获取）
 */
export async function createErrorLibraryEntry(
  data: Pick<ErrorLibrary, 'uploadId' | 'question' | 'solution'>,
): Promise<ErrorLibrary> {
  // 强制从当前会话获取 userId，确保安全性
  const userId = await getCurrentUserId()

  // 验证 upload 属于当前用户
  const upload = await getUploadById(data.uploadId)
  if (!upload) {
    throw new Error('Upload not found or access denied')
  }

  const [newEntry] = await db
    .insert(errorLibrary)
    .values({
      userId,
      ...data,
    })
    .returning()

  return newEntry
}

/**
 * 获取用户的所有错题库记录
 */
export async function getUserErrorLibraryEntries(): Promise<ErrorLibrary[]> {
  const userId = await getCurrentUserId()

  const entries = await db
    .select()
    .from(errorLibrary)
    .where(eq(errorLibrary.userId, userId))
    .orderBy(desc(errorLibrary.createdAt))

  return entries
}

/**
 * 根据 ID 获取错题库记录
 */
export async function getErrorLibraryEntryById(id: string): Promise<ErrorLibrary | null> {
  const userId = await getCurrentUserId()

  const [entry] = await db
    .select()
    .from(errorLibrary)
    .where(and(eq(errorLibrary.id, id), eq(errorLibrary.userId, userId)))

  return entry || null
}

/**
 * 更新错题库记录
 * 只允许更新 question 或 solution 字段（通过类型系统保证）
 * @throws Error 如果记录不存在或无权访问
 */
export async function updateErrorLibraryEntry(
  id: string,
  data: Partial<Pick<ErrorLibrary, 'question' | 'solution'>>,
): Promise<ErrorLibrary> {
  const userId = await getCurrentUserId()

  const [updatedEntry] = await db
    .update(errorLibrary)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(errorLibrary.id, id), eq(errorLibrary.userId, userId)))
    .returning()

  if (!updatedEntry) {
    throw new Error('Error library entry not found or access denied')
  }

  return updatedEntry
}

/**
 * 删除错题库记录
 * @throws Error 如果记录不存在或无权访问
 */
export async function deleteErrorLibraryEntry(id: string): Promise<void> {
  const userId = await getCurrentUserId()

  const [deletedEntry] = await db
    .delete(errorLibrary)
    .where(and(eq(errorLibrary.id, id), eq(errorLibrary.userId, userId)))
    .returning()

  if (!deletedEntry) {
    throw new Error('Error library entry not found or access denied')
  }
}

/**
 * 获取指定上传记录的所有错题库条目
 */
export async function getErrorLibraryEntriesByUploadId(uploadId: string): Promise<ErrorLibrary[]> {
  // 首先验证 upload 属于当前用户
  const upload = await getUploadById(uploadId)
  if (!upload) {
    throw new Error('Upload not found or access denied')
  }

  const entries = await db
    .select()
    .from(errorLibrary)
    .where(eq(errorLibrary.uploadId, uploadId))
    .orderBy(desc(errorLibrary.createdAt))

  return entries
}
