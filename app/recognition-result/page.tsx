"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit3, Check, X, Save, BookOpen, Eye, FileText } from "lucide-react"
import { useRouter } from "next/navigation"

interface RecognitionData {
  question: string
  userSolution?: string
}

function MathJaxRenderer({ content }: { content: string }) {
  useEffect(() => {
    // 动态加载MathJax
    if (typeof window !== "undefined" && !window.MathJax) {
      const script = document.createElement("script")
      script.src = "https://polyfill.io/v3/polyfill.min.js?features=es6"
      document.head.appendChild(script)

      const mathJaxScript = document.createElement("script")
      mathJaxScript.src = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"
      mathJaxScript.async = true
      document.head.appendChild(mathJaxScript)

      window.MathJax = {
        tex: {
          inlineMath: [
            ["$", "$"],
            ["$$", "$$"],
          ],
          displayMath: [
            ["$$", "$$"],
            ["\\[", "\\]"],
          ],
        },
        options: {
          skipHtmlTags: ["script", "noscript", "style", "textarea", "pre"],
        },
      }
    }

    // 重新渲染MathJax
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise()
    }
  }, [content])

  // 简单的Markdown渲染
  const renderMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\n/g, "<br>")
  }

  return <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
}

export default function RecognitionResultPage() {
  const [originalImage, setOriginalImage] = useState<string>("")
  const [recognitionData, setRecognitionData] = useState<RecognitionData>({
    question: "",
    userSolution: "",
  })
  const [editingQuestion, setEditingQuestion] = useState(false)
  const [editingSolution, setEditingSolution] = useState(false)
  const [questionText, setQuestionText] = useState("")
  const [solutionText, setSolutionText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [previewQuestion, setPreviewQuestion] = useState(false)
  const [previewSolution, setPreviewSolution] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 从 sessionStorage 获取上传的图片
    const uploadedImage = sessionStorage.getItem("uploadedImage")
    if (uploadedImage) {
      setOriginalImage(uploadedImage)
      // 模拟AI识别过程
      simulateAIRecognition()
    } else {
      // 如果没有图片数据，返回首页
      router.push("/")
    }
  }, [router])

  const simulateAIRecognition = () => {
    // 模拟AI识别延迟
    setTimeout(() => {
      const mockRecognition: RecognitionData = {
        question:
          "已知函数 $f(x) = 2x^2 - 4x + 1$，求函数的**最小值**。\n\n### 提示\n- 可以使用配方法\n- 注意二次函数的性质",
        userSolution:
          "## 解题过程\n\n**解：** $f(x) = 2x^2 - 4x + 1$\n\n### 步骤1：配方\n$f(x) = 2(x^2 - 2x) + 1$\n\n### 步骤2：完成配方\n$f(x) = 2(x - 1)^2 - 2 + 1$\n\n### 步骤3：化简\n$f(x) = 2(x - 1)^2 - 1$\n\n### 结论\n所以函数的**最小值**为 $-1$，当 $x = 1$ 时取得。",
      }
      setRecognitionData(mockRecognition)
      setQuestionText(mockRecognition.question)
      setSolutionText(mockRecognition.userSolution || "")
      setIsLoading(false)
    }, 2000)
  }

  const handleBack = () => {
    sessionStorage.removeItem("uploadedImage")
    router.push("/")
  }

  const startEditingQuestion = () => {
    setEditingQuestion(true)
    setPreviewQuestion(false)
  }

  const saveQuestion = () => {
    setRecognitionData((prev) => ({ ...prev, question: questionText }))
    setEditingQuestion(false)
    setPreviewQuestion(false)
  }

  const cancelEditingQuestion = () => {
    setQuestionText(recognitionData.question)
    setEditingQuestion(false)
    setPreviewQuestion(false)
  }

  const startEditingSolution = () => {
    setEditingSolution(true)
    setPreviewSolution(false)
  }

  const saveSolution = () => {
    setRecognitionData((prev) => ({ ...prev, userSolution: solutionText }))
    setEditingSolution(false)
    setPreviewSolution(false)
  }

  const cancelEditingSolution = () => {
    setSolutionText(recognitionData.userSolution || "")
    setEditingSolution(false)
    setPreviewSolution(false)
  }

  const handleSaveToLibrary = () => {
    // 这里可以实现保存到错题库的逻辑
    console.log("保存到错题库:", recognitionData)
    // 保存成功后返回首页
    sessionStorage.removeItem("uploadedImage")
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">AI正在识别中...</h2>
          <p className="text-muted-foreground text-sm md:text-base">请稍候，正在分析您的错题图片</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <h1 className="text-lg md:text-xl font-bold text-primary">识别结果</h1>
            </div>
          </div>
          <Button
            onClick={handleSaveToLibrary}
            className="bg-primary hover:bg-primary/90 text-sm md:text-base px-3 md:px-4"
          >
            <Save className="mr-1 md:mr-2 h-4 w-4" />
            <span className="hidden sm:inline">保存到错题库</span>
            <span className="sm:hidden">保存</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-4 md:py-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* 原图展示 */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <CardTitle className="text-base md:text-lg">原图</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-center">
                <img
                  src={originalImage || "/placeholder.svg"}
                  alt="错题原图"
                  className="max-w-full h-auto rounded-lg border border-border max-h-64 md:max-h-96 object-contain"
                />
              </div>
            </CardContent>
          </Card>

          {/* 题目内容 */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  题目内容
                </CardTitle>
                <div className="flex gap-2">
                  {editingQuestion ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewQuestion(!previewQuestion)}
                        className="text-xs md:text-sm bg-transparent"
                      >
                        <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        {previewQuestion ? "编辑" : "预览"}
                      </Button>
                      <Button size="sm" onClick={saveQuestion} className="h-8 w-8 p-0">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditingQuestion}
                        className="h-8 w-8 p-0 bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startEditingQuestion}
                      className="text-xs md:text-sm bg-transparent"
                    >
                      <Edit3 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      编辑
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {editingQuestion ? (
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border">
                    支持Markdown语法：**粗体**、*斜体*、`代码`、数学公式 $x^2$ 或 $$\frac{1}
                    {2}$$
                  </div>
                  {previewQuestion ? (
                    <div className="p-3 md:p-4 bg-muted/30 rounded-lg border border-border min-h-[100px] md:min-h-[120px]">
                      <MathJaxRenderer content={questionText} />
                    </div>
                  ) : (
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="w-full p-3 md:p-4 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring min-h-[100px] md:min-h-[120px] resize-y text-sm md:text-base font-mono"
                      placeholder="请输入题目内容（支持Markdown和数学公式）..."
                    />
                  )}
                </div>
              ) : (
                <div className="p-3 md:p-4 bg-muted/30 rounded-lg border border-border">
                  <MathJaxRenderer content={recognitionData.question} />
                </div>
              )}
            </CardContent>
          </Card>

          {/* 解题过程 */}
          <Card>
            <CardHeader className="pb-3 md:pb-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base md:text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  解题过程
                </CardTitle>
                <div className="flex gap-2">
                  {editingSolution ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewSolution(!previewSolution)}
                        className="text-xs md:text-sm bg-transparent"
                      >
                        <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                        {previewSolution ? "编辑" : "预览"}
                      </Button>
                      <Button size="sm" onClick={saveSolution} className="h-8 w-8 p-0">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditingSolution}
                        className="h-8 w-8 p-0 bg-transparent"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startEditingSolution}
                      className="text-xs md:text-sm bg-transparent"
                    >
                      <Edit3 className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                      编辑
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {editingSolution ? (
                <div className="space-y-3">
                  <div className="text-xs text-muted-foreground bg-muted/30 p-2 rounded border">
                    支持Markdown语法：**粗体**、*斜体*、`代码`、### 标题、数学公式 $x^2$ 或 $$\frac{1}
                    {2}$$
                  </div>
                  {previewSolution ? (
                    <div className="p-3 md:p-4 bg-accent/10 rounded-lg border border-border min-h-[120px] md:min-h-[150px]">
                      <MathJaxRenderer content={solutionText} />
                    </div>
                  ) : (
                    <textarea
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                      className="w-full p-3 md:p-4 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] md:min-h-[150px] resize-y text-sm md:text-base font-mono"
                      placeholder="请输入解题过程（支持Markdown和数学公式，可选）..."
                    />
                  )}
                </div>
              ) : (
                <div className="p-3 md:p-4 bg-accent/10 rounded-lg border border-border">
                  {recognitionData.userSolution ? (
                    <MathJaxRenderer content={recognitionData.userSolution} />
                  ) : (
                    <p className="text-muted-foreground italic text-sm md:text-base">未识别到解题过程</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 操作提示 */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-3 md:p-4">
              <div className="flex items-start gap-3">
                <div className="p-1.5 md:p-2 bg-primary/10 rounded-full flex-shrink-0">
                  <Check className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1 text-sm md:text-base">确认识别结果</h4>
                  <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                    支持Markdown语法和MathJax数学公式渲染。请仔细检查AI识别的内容是否正确，如有错误可点击"编辑"按钮修改。确认无误后点击"保存到错题库"。
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
