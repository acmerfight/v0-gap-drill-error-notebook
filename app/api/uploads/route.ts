import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { userUploads, aiProcessingResults } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { createSuccessResponse, handleApiError } from '@/lib/api-utils';
import { createUploadSchema } from '@/lib/validation';

export async function GET() {
  try {
    const uploads = await db
      .select()
      .from(userUploads)
      .leftJoin(aiProcessingResults, eq(userUploads.id, aiProcessingResults.id))
      .orderBy(desc(userUploads.createdAt));

    return createSuccessResponse(uploads);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validatedData = createUploadSchema.parse(body);

    const [newUpload] = await db
      .insert(userUploads)
      .values(validatedData)
      .returning();

    return createSuccessResponse(newUpload);
  } catch (error) {
    return handleApiError(error);
  }
}