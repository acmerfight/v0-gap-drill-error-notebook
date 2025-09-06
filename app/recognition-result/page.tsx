"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Edit3, Check, X, Save, BookOpen, Eye, FileText, CheckCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { detectLanguage, getTranslations, type Translations } from "@/lib/i18n"

interface RecognitionData {
  question: string
  userSolution?: string
}

function MathJaxRenderer({ content }: { content: string }) {
  useEffect(() => {
    // 重新渲染MathJax
    if (typeof window !== "undefined" && window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise().catch((err: any) => console.error("MathJax rendering error:", err))
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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle")
  const router = useRouter()

  const [currentLang, setCurrentLang] = useState<"zh" | "en">("zh")
  const [t, setT] = useState<Translations>(getTranslations("zh"))

  useEffect(() => {
    const detectedLang = detectLanguage()
    setCurrentLang(detectedLang)
    setT(getTranslations(detectedLang))

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
    setSaveStatus("saving")

    // 模拟保存过程
    setTimeout(() => {
      console.log("保存到错题库:", recognitionData)
      setSaveStatus("success")

      setTimeout(() => {
        sessionStorage.removeItem("uploadedImage")
        router.push("/")
      }, 1500)
    }, 2000)
  }

  const SaveStatusIndicator = () => {
    if (saveStatus === "saving") {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg elevation-2 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
          <span className="text-sm font-medium">{t.saving}</span>
        </div>
      )
    }

    if (saveStatus === "success") {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg elevation-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">{t.saveSuccess}</span>
        </div>
      )
    }

    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <Card className="p-8 text-center elevation-2 bg-card border border-border">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">{t.aiRecognizing}</h2>
          <p className="text-muted-foreground">{t.pleaseWait}</p>
          <div className="mt-4 w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <SaveStatusIndicator />

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border elevation-1">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-muted/50">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold text-primary">{t.recognitionResult}</h1>
            </div>
          </div>
          <Button
            onClick={handleSaveToLibrary}
            disabled={saveStatus === "saving"}
            className="bg-primary hover:bg-primary/90 text-sm px-4 elevation-1 transition-elevation hover:elevation-2"
          >
            <Save className="mr-2 h-4 w-4" />
            {saveStatus === "saving" ? t.saving : t.saveToLibrary}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="elevation-1 transition-elevation hover:elevation-2 bg-card border border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="p-1.5 bg-primary/10 rounded">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                {t.originalImage}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-center p-4 bg-muted/30 rounded-lg">
                <img
                  src={originalImage || "/placeholder.svg"}
                  alt="错题原图"
                  className="max-w-full h-auto rounded-lg border border-border max-h-80 object-contain elevation-1"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="elevation-1 transition-elevation hover:elevation-2 bg-card border border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 bg-accent/10 rounded">
                    <FileText className="h-4 w-4 text-accent" />
                  </div>
                  {t.questionContent}
                </CardTitle>
                <div className="flex gap-2">
                  {editingQuestion ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewQuestion(!previewQuestion)}
                        className="text-sm bg-transparent border-border hover:bg-muted/50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {previewQuestion ? t.edit : t.preview}
                      </Button>
                      <Button size="sm" onClick={saveQuestion} className="h-9 px-3 elevation-1">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditingQuestion}
                        className="h-9 px-3 bg-transparent border-border hover:bg-muted/50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startEditingQuestion}
                      className="text-sm bg-transparent border-border hover:bg-muted/50"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      {t.edit}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {editingQuestion ? (
                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span className="font-medium">{t.markdownSupport}</span>
                    </div>
                    <p>{t.markdownSyntax}</p>
                  </div>
                  {previewQuestion ? (
                    <div className="p-4 bg-muted/30 rounded-lg border border-border min-h-[120px] elevation-1">
                      <MathJaxRenderer content={questionText} />
                    </div>
                  ) : (
                    <textarea
                      value={questionText}
                      onChange={(e) => setQuestionText(e.target.value)}
                      className="w-full p-4 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring min-h-[120px] resize-y text-sm font-mono transition-all duration-200"
                      placeholder="请输入题目内容（支持Markdown和数学公式）..."
                    />
                  )}
                </div>
              ) : (
                <div className="p-4 bg-muted/30 rounded-lg border border-border elevation-1">
                  <MathJaxRenderer content={recognitionData.question} />
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="elevation-1 transition-elevation hover:elevation-2 bg-card border border-border">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="p-1.5 bg-chart-2/10 rounded">
                    <FileText className="h-4 w-4 text-chart-2" />
                  </div>
                  {t.solutionProcess}
                </CardTitle>
                <div className="flex gap-2">
                  {editingSolution ? (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setPreviewSolution(!previewSolution)}
                        className="text-sm bg-transparent border-border hover:bg-muted/50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {previewSolution ? t.edit : t.preview}
                      </Button>
                      <Button size="sm" onClick={saveSolution} className="h-9 px-3 elevation-1">
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={cancelEditingSolution}
                        className="h-9 px-3 bg-transparent border-border hover:bg-muted/50"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={startEditingSolution}
                      className="text-sm bg-transparent border-border hover:bg-muted/50"
                    >
                      <Edit3 className="h-4 w-4 mr-1" />
                      {t.edit}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              {editingSolution ? (
                <div className="space-y-4">
                  <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span className="font-medium">{t.markdownSupport}</span>
                    </div>
                    <p>{t.markdownSyntax}</p>
                  </div>
                  {previewSolution ? (
                    <div className="p-4 bg-accent/5 rounded-lg border border-border min-h-[150px] elevation-1">
                      <MathJaxRenderer content={solutionText} />
                    </div>
                  ) : (
                    <textarea
                      value={solutionText}
                      onChange={(e) => setSolutionText(e.target.value)}
                      className="w-full p-4 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring min-h-[150px] resize-y text-sm font-mono transition-all duration-200"
                      placeholder="请输入解题过程（支持Markdown和数学公式，可选）..."
                    />
                  )}
                </div>
              ) : (
                <div className="p-4 bg-accent/5 rounded-lg border border-border elevation-1">
                  {recognitionData.userSolution ? (
                    <MathJaxRenderer content={recognitionData.userSolution} />
                  ) : (
                    <p className="text-muted-foreground italic text-sm">{t.noSolutionFound}</p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20 elevation-1">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-full flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-2">{t.confirmResult}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.confirmResultDesc}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
