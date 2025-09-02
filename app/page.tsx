"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, Zap, BookOpen, History, BarChart3, User, Search, Bell } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false)
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
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        // 将图片数据存储到 sessionStorage 并跳转到识别结果页面
        sessionStorage.setItem("uploadedImage", imageData)
        router.push("/recognition-result")
      }
      reader.readAsDataURL(file)
    }
  }

  const openCamera = () => {
    // 这里可以实现相机功能，暂时模拟跳转
    console.log("Opening camera...")
    // 模拟相机拍照后的跳转
    router.push("/recognition-result")
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            <h1 className="text-xl md:text-2xl font-bold text-primary">GapDrill</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            <div className="hidden md:flex flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="搜索错题..."
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-input focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* 欢迎 Section */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">智能错题管理</h2>
          <p className="text-muted-foreground text-base md:text-lg text-pretty">
            拍照上传错题，AI智能识别，让学习更高效
          </p>
        </div>

        {/* Upload Section */}
        <Card className="mb-8 bg-card border-2 border-dashed border-border hover:border-primary/50 transition-colors">
          <CardContent className="p-4 md:p-8">
            <div
              className={`text-center ${dragActive ? "bg-muted/50" : ""} rounded-lg p-6 md:p-8 transition-colors`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="flex justify-center mb-4">
                <div className="p-3 md:p-4 bg-primary/10 rounded-full">
                  <Upload className="h-8 w-8 md:h-12 md:w-12 text-primary" />
                </div>
              </div>

              <h3 className="text-lg md:text-xl font-semibold text-card-foreground mb-2">上传错题图片</h3>
              <p className="text-muted-foreground mb-6 text-sm md:text-base">拖拽图片到此处，或点击下方按钮选择文件</p>

              <div className="flex flex-col gap-3 md:flex-row md:gap-4 md:justify-center">
                <Button
                  onClick={openCamera}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 md:h-auto"
                  size="lg"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  拍照上传
                </Button>

                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/10 h-12 md:h-auto"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  选择图片
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInput} className="hidden" />
            </div>
          </CardContent>
        </Card>

        {/* AI Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-accent/10 rounded-full">
                <Zap className="h-6 w-6 md:h-8 md:w-8 text-accent" />
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">AI智能识别</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              自动识别图片中的文字和数学公式，准确率高达95%
            </p>
          </Card>

          <Card className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-primary/10 rounded-full">
                <BookOpen className="h-6 w-6 md:h-8 md:w-8 text-primary" />
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">错题整理</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              自动分类整理错题，建立个人专属错题库
            </p>
          </Card>

          <Card className="text-center p-4 md:p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-center mb-3 md:mb-4">
              <div className="p-2 md:p-3 bg-chart-2/10 rounded-full">
                <BarChart3 className="h-6 w-6 md:h-8 md:w-8 text-chart-2" />
              </div>
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-sm md:text-base">学习分析</h3>
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              智能分析学习薄弱点，提供个性化学习建议
            </p>
          </Card>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t border-border safe-area-pb">
        <div className="flex justify-around items-center py-3 px-2">
          <Button variant="ghost" className="flex flex-col items-center gap-1 text-primary min-w-0 px-2">
            <BookOpen className="h-5 w-5" />
            <span className="text-xs">首页</span>
          </Button>

          <Button variant="ghost" className="flex flex-col items-center gap-1 text-muted-foreground min-w-0 px-2">
            <History className="h-5 w-5" />
            <span className="text-xs">历史</span>
          </Button>

          <Button variant="ghost" className="flex flex-col items-center gap-1 text-muted-foreground min-w-0 px-2">
            <BarChart3 className="h-5 w-5" />
            <span className="text-xs">分析</span>
          </Button>

          <Button variant="ghost" className="flex flex-col items-center gap-1 text-muted-foreground min-w-0 px-2">
            <User className="h-5 w-5" />
            <span className="text-xs">我的</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
