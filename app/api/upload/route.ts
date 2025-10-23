import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { UPLOAD_CONFIG } from '@/lib/constants'

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
        return {
          allowedContentTypes: [...UPLOAD_CONFIG.ALLOWED_CONTENT_TYPES],
          maximumSizeInBytes: UPLOAD_CONFIG.MAX_FILE_SIZE,
          addRandomSuffix: true,
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
