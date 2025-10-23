import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { del } from '@vercel/blob'
import { createUpload } from '@/lib/internal-db'
import { z } from 'zod'

/**
 * 上传确认请求体验证
 */
const UploadConfirmSchema = z.object({
  imageUrl: z
    .url('Invalid URL format')
    .regex(/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/.+$/, 'URL must be from Vercel Blob Storage'),
})

/**
 * POST /api/uploads
 *
 * 保存上传链接到数据库
 * @returns {Object} { success: true, upload: { id, imageUrl, userId, createdAt } }
 */
export async function POST(request: Request): Promise<NextResponse> {
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. 解析并验证请求体
  const body: unknown = await request.json()
  const validationResult = UploadConfirmSchema.safeParse(body)

  if (!validationResult.success) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: z.treeifyError(validationResult.error),
      },
      { status: 400 },
    )
  }

  const { imageUrl } = validationResult.data

  // 3. 保存到数据库
  try {
    const upload = await createUpload(imageUrl)

    return NextResponse.json(
      {
        success: true,
        upload: {
          id: upload.id,
          imageUrl: upload.imageUrl,
          userId: upload.userId,
          createdAt: upload.createdAt,
        },
      },
      { status: 201 },
    )
  } catch (dbError) {
    await del(imageUrl)
    throw dbError
  }
}
