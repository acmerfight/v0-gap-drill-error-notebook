import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { userUploads, aiProcessingResults } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { createSuccessResponse, createErrorResponse, handleApiError } from '@/lib/api-utils';
import { updateUploadSchema, uuidSchema } from '@/lib/validation';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedId = uuidSchema.parse(id);

    const [upload] = await db
      .select()
      .from(userUploads)
      .leftJoin(aiProcessingResults, eq(userUploads.id, aiProcessingResults.id))
      .where(eq(userUploads.id, validatedId));

    if (!upload) {
      return createErrorResponse('Upload not found', 'NOT_FOUND', 404);
    }

    return createSuccessResponse(upload);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedId = uuidSchema.parse(id);
    
    const body: unknown = await request.json();
    const validatedData = updateUploadSchema.parse(body);
    
    const [updatedUpload] = await db
      .update(userUploads)
      .set({ 
        ...validatedData,
        updatedAt: new Date()
      })
      .where(eq(userUploads.id, validatedId))
      .returning();

    if (!updatedUpload) {
      return createErrorResponse('Upload not found', 'NOT_FOUND', 404);
    }

    return createSuccessResponse(updatedUpload);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const validatedId = uuidSchema.parse(id);

    const [deletedUpload] = await db
      .delete(userUploads)
      .where(eq(userUploads.id, validatedId))
      .returning();

    if (!deletedUpload) {
      return createErrorResponse('Upload not found', 'NOT_FOUND', 404);
    }

    return createSuccessResponse({ message: 'Upload deleted successfully' });
  } catch (error) {
    return handleApiError(error);
  }
}