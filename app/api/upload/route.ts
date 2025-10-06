import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { UPLOAD_CONFIG } from '@/lib/constants'
import { createUpload } from '@/lib/internal-db'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody

    // 提前获取 userId，避免在回调中获取失败
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const jsonResponse = await handleUpload({
      body,
      request,
      // eslint-disable-next-line require-await
      onBeforeGenerateToken: async () => {
        // 优先使用自定义域名，回退到 VERCEL_URL，最后是 localhost
        const baseUrl =
          process.env.NEXT_PUBLIC_APP_URL ??
          (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

        return {
          allowedContentTypes: [...UPLOAD_CONFIG.ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: UPLOAD_CONFIG.MAX_FILE_SIZE,
          addRandomSuffix: true,
          callbackUrl: `${baseUrl}/api/upload`,
        }
      },
      onUploadCompleted: async ({ blob }) => {
        try {
          // eslint-disable-next-line no-console
          console.log('finished uploaded image url:', blob.url)
          // 使用捕获的 userId，避免在回调中再次调用 auth()
          await createUpload({ imageUrl: blob.url, userId })
          // eslint-disable-next-line no-console
          console.log('successfully saved to database')
        } catch (dbError) {
          // 数据库保存失败不应该影响上传流程
          // eslint-disable-next-line no-console
          console.error('failed to save upload to database:', dbError)
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const status = errorMessage === 'Unauthorized' ? 401 : 400

    return NextResponse.json({ error: errorMessage }, { status })
  }
}
