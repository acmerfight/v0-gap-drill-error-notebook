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
    .string()
    .url('Invalid URL format')
    .regex(/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/.+$/, 'URL must be from Vercel Blob Storage'),
})

/**
 * POST /api/uploads
 *
 * 保存上传链接到数据库
 *
 * 业界最佳实践：前端直传后主动通知后端保存链接
 * 流程：
 * 1. 前端获取上传令牌（POST /api/upload）
 * 2. 前端直接上传到 Vercel Blob
 * 3. 上传成功后，前端调用此 API 保存链接
 *
 * @returns {Object} { success: true, upload: { id, imageUrl, userId, createdAt } }
 */
export async function POST(request: Request): Promise<NextResponse> {
  // 1. 身份验证
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
        details: validationResult.error.format(),
      },
      { status: 400 },
    )
  }

  const { imageUrl } = validationResult.data

  // 3. 保存到数据库
  try {
    const upload = await createUpload({
      imageUrl,
    })

    // eslint-disable-next-line no-console
    console.log('✅ Upload saved to database:', {
      uploadId: upload.id,
      userId,
      imageUrl,
      createdAt: upload.createdAt,
    })

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
    // 4. 数据库保存失败时的资源清理
    // eslint-disable-next-line no-console
    console.error('❌ Database save failed, initiating blob cleanup:', {
      imageUrl,
      userId,
      error: dbError instanceof Error ? dbError.message : String(dbError),
    })

    // 尝试清理已上传的 blob
    try {
      await del(imageUrl)
      // eslint-disable-next-line no-console
      console.log('✅ Blob cleanup successful:', { imageUrl })
    } catch (delError) {
      // 清理失败不应阻止错误响应，但需要记录
      // eslint-disable-next-line no-console
      console.error('⚠️  Blob cleanup failed (manual cleanup may be required):', {
        imageUrl,
        error: delError instanceof Error ? delError.message : String(delError),
      })
    }

    // 抛出原始错误以便统一处理
    throw dbError
  }
}
