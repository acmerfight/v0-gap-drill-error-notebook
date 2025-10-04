import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { UPLOAD_CONFIG } from '@/lib/constants'

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const { userId } = await auth()
        if (!userId) {
          throw new Error('Unauthorized')
        }

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
      onUploadCompleted: ({ blob }) => {
        // TODO: Add database logging if needed
        // eslint-disable-next-line no-console
        console.log('finished uploaded image url:', blob.url)
        return Promise.resolve()
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    const status = errorMessage === 'Unauthorized' ? 401 : 400

    return NextResponse.json({ error: errorMessage }, { status })
  }
}
