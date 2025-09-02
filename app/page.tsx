"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, Zap, BookOpen, History, BarChart3, User, Bell, CheckCircle, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs"

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full shadow-lg elevation-2 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
          <span className="text-sm font-medium">正在上传...</span>
        </div>
      )
    }

    if (uploadStatus === "success") {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-4 py-2 rounded-full shadow-lg elevation-2 flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm font-medium">上传成功！</span>
        </div>
      )
    }

    if (uploadStatus === "error") {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-4 py-2 rounded-full shadow-lg elevation-2 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm font-medium">上传失败，请重试</span>
        </div>
      )
    }

    return null
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <StatusIndicator />

      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border elevation-1">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">GapDrill</h1>
              <p className="text-xs text-muted-foreground">智能错题本</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" size="sm" className="text-sm bg-transparent">
                  登录
                </Button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full"></span>
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <SignedOut>
          <div className="text-center mb-8 px-4">
            <div className="mb-6">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <BookOpen className="h-12 w-12 text-primary" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">欢迎使用 GapDrill</h2>
              <p className="text-muted-foreground text-lg text-pretty max-w-md mx-auto leading-relaxed">
                AI驱动的智能错题管理系统，让学习更高效
              </p>
            </div>

            <SignInButton mode="modal">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-medium elevation-2 transition-elevation hover:elevation-3"
              >
                开始使用
              </Button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-balance">智能错题识别</h2>
            <p className="text-muted-foreground text-base text-pretty">拍照上传错题，AI智能识别，让学习更高效</p>
          </div>

          <Card className="mb-8 bg-card border border-border elevation-1 transition-elevation hover:elevation-2 overflow-hidden">
            <CardContent className="p-0">
              <div
                className={`text-center p-8 transition-all duration-300 ${
                  dragActive ? "bg-primary/5 border-primary/30" : ""
                } ${uploadStatus === "uploading" ? "opacity-50 pointer-events-none" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Upload className="h-12 w-12 text-primary" />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-card-foreground mb-2">上传错题图片</h3>
                <p className="text-muted-foreground mb-8 text-base max-w-md mx-auto">
                  拖拽图片到此处，或点击下方按钮选择文件
                </p>

                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                  <Button
                    onClick={openCamera}
                    disabled={uploadStatus === "uploading"}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-medium elevation-1 transition-elevation hover:elevation-2"
                    size="lg"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    {uploadStatus === "uploading" ? "处理中..." : "拍照上传"}
                  </Button>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadStatus === "uploading"}
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary/5 h-12 text-base font-medium transition-all duration-200"
                  >
                    <Upload className="mr-2 h-5 w-5" />
                    选择图片
                  </Button>
                </div>

                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <Card className="p-6 elevation-1 transition-elevation hover:elevation-2 bg-card border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-full flex-shrink-0">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">AI智能识别</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    自动识别图片中的文字和数学公式，准确率高达95%，支持手写和印刷体
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 elevation-1 transition-elevation hover:elevation-2 bg-card border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-accent/10 rounded-full flex-shrink-0">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">错题整理</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    自动分类整理错题，建立个人专属错题库，支持标签和搜索功能
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 elevation-1 transition-elevation hover:elevation-2 bg-card border border-border">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-chart-2/10 rounded-full flex-shrink-0">
                  <BarChart3 className="h-6 w-6 text-chart-2" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">学习分析</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    智能分析学习薄弱点，提供个性化学习建议和复习计划
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </SignedIn>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border elevation-3 safe-area-pb">
        <div className="flex justify-around items-center py-3 px-2">
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-primary min-w-0 px-3 py-2 h-auto">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-medium">首页</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground min-w-0 px-3 py-2 h-auto transition-colors"
          >
            <History className="h-5 w-5" />
            <span className="text-xs">历史</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground min-w-0 px-3 py-2 h-auto transition-colors"
          >
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">分析</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-foreground min-w-0 px-3 py-2 h-auto transition-colors"
          >
            <User className="h-5 w-5" />
            <span className="text-xs">我的</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
