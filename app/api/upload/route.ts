import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const { userId } = await auth();
        if (!userId) {
          throw new Error('Unauthorized');
        }

        return {
          allowedContentTypes: [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/webp',
            'image/heic',
            'image/heif',
          ],
          maximumSizeInBytes: 10 * 1024 * 1024, // 10MB
        };
      },
      onUploadCompleted: () => {
        // Upload completed: blob.url available
        // TODO: Add database logging if needed
        return Promise.resolve();
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const status = errorMessage === 'Unauthorized' ? 401 : 400;

    return NextResponse.json({ error: errorMessage }, { status });
  }
}
