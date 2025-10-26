import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { userUploads, aiProcessingResults } from '@/lib/schema'
import { eq } from 'drizzle-orm'

/**
 * AI 识别请求验证
 */
const RecognizeRequestSchema = z.object({
  uploadId: z.string().uuid('Invalid upload ID format'),
  imageUrl: z
    .url('Invalid URL format')
    .regex(/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/.+$/, 'URL must be from Vercel Blob Storage'),
})

/**
 * 调用 AI 识别服务
 * TODO: 替换为你的真实 AI 识别服务（如 OpenAI GPT-4 Vision、Claude、自定义模型等）
 */
async function callAIRecognitionService(_imageUrl: string): Promise<{
  question: string
  solution: string
}> {
  // ============================================
  // 🔥 这里替换为真实的 AI 识别调用
  // ============================================

  // 示例 1: OpenAI GPT-4 Vision API
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4-vision-preview',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: '请识别这张图片中的数学题目和解题过程。返回格式：{"question": "题目内容", "solution": "解题过程"}'
            },
            {
              type: 'image_url',
              image_url: { url: imageUrl }
            }
          ]
        }
      ],
      max_tokens: 1000,
    }),
  })

  const data = await response.json()
  const result = JSON.parse(data.choices[0].message.content)
  return result
  */

  // 示例 2: 自定义 AI 服务
  /*
  const response = await fetch('https://your-ai-service.com/api/recognize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.AI_SERVICE_API_KEY}`,
    },
    body: JSON.stringify({ imageUrl }),
  })

  if (!response.ok) {
    throw new Error('AI recognition failed')
  }

  return await response.json()
  */

  // 临时模拟数据（开发阶段）
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    question: '已知函数 $f(x) = 2x^2 - 4x + 1$，求函数的**最小值**。\n\n### 提示\n- 可以使用配方法\n- 注意二次函数的性质',
    solution:
      '## 解题过程\n\n**解：** $f(x) = 2x^2 - 4x + 1$\n\n### 步骤1：配方\n$f(x) = 2(x^2 - 2x) + 1$\n\n### 步骤2：完成配方\n$f(x) = 2(x - 1)^2 - 2 + 1$\n\n### 步骤3：化简\n$f(x) = 2(x - 1)^2 - 1$\n\n### 结论\n所以函数的**最小值**为 $-1$，当 $x = 1$ 时取得。',
  }
}

/**
 * POST /api/recognize
 *
 * 调用 AI 识别图片中的题目和解题过程
 * @returns {Object} { success: true, result: { question, solution } }
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    // 1. 认证检查
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. 解析并验证请求体
    const body: unknown = await request.json()
    const validationResult = RecognizeRequestSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: z.treeifyError(validationResult.error),
        },
        { status: 400 },
      )
    }

    const { uploadId, imageUrl } = validationResult.data

    // 3. 验证上传记录是否属于当前用户
    const upload = await db.query.userUploads.findFirst({
      where: eq(userUploads.id, uploadId),
    })

    if (!upload) {
      return NextResponse.json({ error: 'Upload not found' }, { status: 404 })
    }

    if (upload.userId !== userId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // 4. 检查是否已经识别过
    const existingResult = await db.query.aiProcessingResults.findFirst({
      where: eq(aiProcessingResults.id, uploadId),
    })

    if (existingResult) {
      return NextResponse.json({
        success: true,
        result: {
          question: existingResult.aiQuestion,
          solution: existingResult.aiSolution,
        },
        cached: true,
      })
    }

    // 5. 调用 AI 识别服务
    const aiResult = await callAIRecognitionService(imageUrl)

    // 6. 保存识别结果到数据库
    await db.insert(aiProcessingResults).values({
      id: uploadId,
      aiQuestion: aiResult.question,
      aiSolution: aiResult.solution,
    })

    // 7. 返回识别结果
    return NextResponse.json({
      success: true,
      result: {
        question: aiResult.question,
        solution: aiResult.solution,
      },
      cached: false,
    })
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('AI recognition error:', error)

    return NextResponse.json(
      {
        error: 'AI recognition failed',
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
