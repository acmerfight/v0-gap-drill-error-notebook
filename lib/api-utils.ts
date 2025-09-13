import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
    details?: any;
  };
}

export function createSuccessResponse<T>(data: T): NextResponse<ApiResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
  });
}

export function createErrorResponse(
  message: string,
  code: string = 'INTERNAL_ERROR',
  status: number = 500,
  details?: any
): NextResponse<ApiResponse> {
  return NextResponse.json(
    {
      success: false,
      error: {
        message,
        code,
        details,
      },
    },
    { status }
  );
}

export function handleApiError(error: unknown): NextResponse<ApiResponse> {
  console.error('API Error:', error);

  if (error instanceof ZodError) {
    return createErrorResponse(
      'Invalid input data',
      'VALIDATION_ERROR',
      400,
      error.errors
    );
  }

  if (error instanceof Error) {
    if (error.message.includes('unique constraint')) {
      return createErrorResponse(
        'Resource already exists',
        'DUPLICATE_RESOURCE',
        409
      );
    }

    if (error.message.includes('foreign key constraint')) {
      return createErrorResponse(
        'Referenced resource not found',
        'INVALID_REFERENCE',
        400
      );
    }
  }

  return createErrorResponse(
    'An unexpected error occurred',
    'INTERNAL_ERROR',
    500
  );
}