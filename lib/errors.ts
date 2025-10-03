/**
 * 自定义错误类定义
 */

export class UnauthorizedError extends Error {
  public readonly statusCode = 401

  constructor(message = 'Unauthorized') {
    super(message)
    this.name = 'UnauthorizedError'
  }
}

export class ValidationError extends Error {
  public readonly statusCode = 400

  constructor(message = 'Validation failed') {
    super(message)
    this.name = 'ValidationError'
  }
}

export class InternalServerError extends Error {
  public readonly statusCode = 500

  constructor(message = 'Internal server error') {
    super(message)
    this.name = 'InternalServerError'
  }
}

/**
 * 错误处理工具函数
 */
export function handleApiError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof UnauthorizedError || error instanceof ValidationError || error instanceof InternalServerError) {
    return {
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  // 处理其他类型的错误
  const message = error instanceof Error ? error.message : String(error)
  return {
    message: message || 'Unknown error occurred',
    statusCode: 500,
  }
}
