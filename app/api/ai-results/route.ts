import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { aiProcessingResults, userUploads } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { createSuccessResponse, handleApiError } from '@/lib/api-utils';
import { createAiResultSchema } from '@/lib/validation';

export async function GET() {
  try {
    const results = await db
      .select()
      .from(aiProcessingResults)
      .leftJoin(userUploads, eq(aiProcessingResults.id, userUploads.id))
      .orderBy(desc(aiProcessingResults.createdAt));

    return createSuccessResponse(results);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const validatedData = createAiResultSchema.parse(body);

    const [newResult] = await db
      .insert(aiProcessingResults)
      .values(validatedData)
      .returning();

    return createSuccessResponse(newResult);
  } catch (error) {
    return handleApiError(error);
  }
}