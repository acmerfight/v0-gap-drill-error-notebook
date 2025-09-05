"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Camera,
  Upload,
  Zap,
  BookOpen,
  History,
  BarChart3,
  User,
  Bell,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Target,
  TrendingUp,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs"

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { user, isLoaded } = useUser()

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const file = files[0]
    if (file) {
      setUploadStatus("uploading")

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        sessionStorage.setItem("uploadedImage", imageData)
        setUploadStatus("success")

        setTimeout(() => {
          router.push("/recognition-result")
        }, 800)
      }
      reader.onerror = () => {
        setUploadStatus("error")
        setTimeout(() => setUploadStatus("idle"), 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  const openCamera = () => {
    setUploadStatus("uploading")
    // 模拟相机拍照过程
    setTimeout(() => {
      setUploadStatus("success")
      setTimeout(() => {
        router.push("/recognition-result")
      }, 800)
    }, 1500)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const StatusIndicator = () => {
    if (uploadStatus === "uploading") {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 gradient-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg elevation-3 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
          <span className="text-sm font-medium">AI正在识别中...</span>
        </div>
      )
    }

    if (uploadStatus === "success") {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg elevation-3 flex items-center gap-3">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">识别成功！正在跳转...</span>
        </div>
      )
    }

    if (uploadStatus === "error") {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-3 rounded-full shadow-lg elevation-3 flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">识别失败，请重试</span>
        </div>
      )
    }

    return null
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-3 border-primary border-t-transparent mx-auto mb-6"></div>
          <p className="text-muted-foreground text-lg">正在加载应用...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <StatusIndicator />

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-b border-border elevation-2">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center gap-4">
            <div className="p-2 gradient-primary rounded-xl elevation-1">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">GapDrill</h1>
              <p className="text-sm text-muted-foreground font-medium">AI智能错题本</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <SignedIn>
              <Button variant="ghost" size="icon" className="relative hover:bg-primary/10">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full border-2 border-background"></span>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="px-6 py-8">
        <SignedOut>
          <div className="text-center mb-12 px-4">
            <div className="mb-8">
              <div className="inline-flex p-6 gradient-primary rounded-2xl mb-6 elevation-2">
                <Sparkles className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-foreground mb-4 text-balance">欢迎使用 GapDrill</h2>
              <p className="text-muted-foreground text-xl text-pretty max-w-lg mx-auto leading-relaxed">
                AI驱动的智能错题管理系统
                <br />
                让学习更高效，进步更明显
              </p>
            </div>

            <div className="max-w-sm mx-auto">
              <Card className="p-8 elevation-2 gradient-card border border-border rounded-2xl">
                <div className="text-center">
                  <div className="p-4 bg-primary/10 rounded-2xl inline-flex mb-4">
                    <User className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">开始使用</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    请先登录账户，即可开始使用AI智能错题识别功能
                  </p>
                  <SignInButton mode="modal" forceRedirectUrl="/" signUpForceRedirectUrl="/">
                    <Button
                      size="lg"
                      className="gradient-primary hover:opacity-90 text-primary-foreground h-14 text-lg font-semibold elevation-2 transition-elevation hover:elevation-3 rounded-xl w-full"
                    >
                      <User className="mr-3 h-6 w-6" />
                      立即登录
                    </Button>
                  </SignInButton>
                </div>
              </Card>
            </div>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">AI智能错题识别</h2>
            <p className="text-muted-foreground text-lg text-pretty max-w-md mx-auto">
              拍照上传错题，AI瞬间识别，学习效率翻倍
            </p>
          </div>

          <Card className="mb-10 gradient-card border-2 border-border elevation-2 transition-elevation hover:elevation-3 overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div
                className={`text-center p-10 transition-all duration-300 ${
                  dragActive ? "bg-primary/10 border-primary/30 scale-[1.02]" : ""
                } ${uploadStatus === "uploading" ? "opacity-50 pointer-events-none" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex justify-center mb-8">
                  <div className="p-6 gradient-primary rounded-2xl elevation-2">
                    <Upload className="h-16 w-16 text-white" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-card-foreground mb-3">上传错题图片</h3>
                <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto leading-relaxed">
                  拖拽图片到此处，或点击下方按钮
                  <br />
                  支持手写和印刷体，识别准确率95%+
                </p>

                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                  <Button
                    onClick={openCamera}
                    disabled={uploadStatus === "uploading"}
                    className="gradient-primary hover:opacity-90 text-primary-foreground h-14 text-lg font-semibold elevation-2 transition-elevation hover:elevation-3 rounded-xl"
                    size="lg"
                  >
                    <Camera className="mr-3 h-6 w-6" />
                    {uploadStatus === "uploading" ? "AI识别中..." : "拍照识别"}
                  </Button>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadStatus === "uploading"}
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary/5 h-14 text-lg font-medium transition-all duration-200 rounded-xl"
                  >
                    <Upload className="mr-3 h-6 w-6" />
                    选择图片
                  </Button>
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-6 mb-10">
            <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-card border border-border rounded-2xl">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-primary/10 rounded-2xl flex-shrink-0">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">AI智能识别</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    先进的OCR技术结合深度学习，自动识别图片中的文字和数学公式，支持手写和印刷体，准确率高达95%以上
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-card border border-border rounded-2xl">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-accent/10 rounded-2xl flex-shrink-0">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">智能分类整理</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    自动按学科、难度、错误类型分类整理错题，建立个人专属错题库，支持智能标签和快速搜索功能
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-card border border-border rounded-2xl">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-chart-2/10 rounded-2xl flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-chart-2" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">学习分析报告</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">
                    深度分析学习薄弱点和进步趋势，提供个性化学习建议和科学复习计划，让每次学习都更有针对性
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </SignedIn>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 border-t border-border elevation-4 safe-area-pb">
        <div className="flex justify-around items-center py-4 px-2">
          <Button
            variant="ghost"
            className="flex flex-col items-center gap-2 text-primary min-w-0 px-4 py-3 h-auto rounded-xl"
          >
            <BookOpen className="h-6 w-6" />
            <span className="text-xs font-semibold">首页</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground min-w-0 px-4 py-3 h-auto transition-colors rounded-xl hover:bg-primary/5"
          >
            <History className="h-6 w-6" />
            <span className="text-xs font-medium">历史</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground min-w-0 px-4 py-3 h-auto transition-colors rounded-xl hover:bg-primary/5"
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs font-medium">分析</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground min-w-0 px-4 py-3 h-auto transition-colors rounded-xl hover:bg-primary/5"
          >
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">我的</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
