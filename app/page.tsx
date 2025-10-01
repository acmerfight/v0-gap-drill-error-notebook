'use client'

import type React from 'react'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
  Brain,
  Award,
  ArrowRight,
  Play,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/nextjs'
import { detectLanguage, getTranslations, type Translations } from '@/lib/i18n'

export default function HomePage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { isLoaded } = useUser()

  const [, setCurrentLang] = useState<'zh' | 'en'>('zh')
  const [t, setT] = useState<Translations>(getTranslations('zh'))

  useEffect(() => {
    const detectedLang = detectLanguage()
    setCurrentLang(detectedLang)
    setT(getTranslations(detectedLang))
  }, [setCurrentLang])

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
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
      setUploadStatus('uploading')

      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target?.result as string
        sessionStorage.setItem('uploadedImage', imageData)
        setUploadStatus('success')

        setTimeout(() => {
          router.push('/recognition-result')
        }, 800)
      }
      reader.onerror = () => {
        setUploadStatus('error')
        setTimeout(() => setUploadStatus('idle'), 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  const openCamera = () => {
    setUploadStatus('uploading')
    // 模拟相机拍照过程
    setTimeout(() => {
      setUploadStatus('success')
      setTimeout(() => {
        router.push('/recognition-result')
      }, 800)
    }, 1500)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const StatusIndicator = () => {
    if (uploadStatus === 'uploading') {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 gradient-primary text-primary-foreground px-6 py-3 rounded-full shadow-lg elevation-3 flex items-center gap-3">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary-foreground border-t-transparent"></div>
          <span className="text-sm font-medium">{t.recognizing}</span>
        </div>
      )
    }

    if (uploadStatus === 'success') {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg elevation-3 flex items-center gap-3">
          <CheckCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{t.recognitionSuccess}</span>
        </div>
      )
    }

    if (uploadStatus === 'error') {
      return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-3 rounded-full shadow-lg elevation-3 flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-medium">{t.recognitionFailed}</span>
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
          <p className="text-muted-foreground text-lg">{t.loadingApp}</p>
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
              <h1 className="text-2xl font-bold text-primary">{t.appName}</h1>
              <p className="text-sm text-muted-foreground font-medium">{t.appSubtitle}</p>
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
          {/* Hero Section */}
          <section className="text-center mb-16 px-4">
            <div className="mb-8">
              <div className="inline-flex p-8 gradient-primary rounded-3xl mb-8 elevation-3">
                <Brain className="h-20 w-20 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-foreground mb-6 text-balance leading-tight">{t.heroTitle}</h1>
              <p className="text-muted-foreground text-xl text-pretty max-w-2xl mx-auto leading-relaxed mb-8">
                {t.heroSubtitle}
              </p>
              <SignInButton mode="modal" forceRedirectUrl="/" signUpForceRedirectUrl="/">
                <Button
                  size="lg"
                  className="gradient-primary hover:opacity-90 text-primary-foreground h-16 text-xl font-semibold elevation-3 transition-elevation hover:elevation-4 rounded-2xl px-12"
                >
                  <Play className="mr-3 h-7 w-7" />
                  {t.getStarted}
                  <ArrowRight className="ml-3 h-7 w-7" />
                </Button>
              </SignInButton>
            </div>
          </section>

          {/* Core Value Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t.coreValueTitle}</h2>
              <p className="text-muted-foreground text-lg max-w-3xl mx-auto leading-relaxed">{t.coreValueDesc}</p>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t.howItWorksTitle}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-feature border border-border rounded-2xl text-center">
                <div className="p-6 bg-primary/10 rounded-3xl inline-flex mb-6">
                  <Camera className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{t.step1Title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.step1Desc}</p>
              </Card>

              <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-feature border border-border rounded-2xl text-center">
                <div className="p-6 bg-accent/10 rounded-3xl inline-flex mb-6">
                  <Brain className="h-12 w-12 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{t.step2Title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.step2Desc}</p>
              </Card>

              <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-feature border border-border rounded-2xl text-center">
                <div className="p-6 bg-chart-2/10 rounded-3xl inline-flex mb-6">
                  <Target className="h-12 w-12 text-chart-2" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4">{t.step3Title}</h3>
                <p className="text-muted-foreground leading-relaxed">{t.step3Desc}</p>
              </Card>
            </div>
          </section>

          {/* Why Choose Us Section */}
          <section className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">{t.whyChooseTitle}</h2>
            </div>
            <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
              <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-card border border-border rounded-2xl">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-primary/10 rounded-2xl flex-shrink-0">
                    <Sparkles className="h-10 w-10 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{t.aiPoweredTitle}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{t.aiPoweredDesc}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-card border border-border rounded-2xl">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-accent/10 rounded-2xl flex-shrink-0">
                    <Target className="h-10 w-10 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{t.targetedLearningTitle}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{t.targetedLearningDesc}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-card border border-border rounded-2xl">
                <div className="flex items-start gap-6">
                  <div className="p-4 bg-chart-2/10 rounded-2xl flex-shrink-0">
                    <TrendingUp className="h-10 w-10 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{t.efficientPracticeTitle}</h3>
                    <p className="text-muted-foreground leading-relaxed text-lg">{t.efficientPracticeDesc}</p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center mb-16">
            <Card className="p-12 elevation-3 gradient-primary border-0 rounded-3xl max-w-2xl mx-auto">
              <div className="text-center">
                <div className="p-6 bg-white/20 rounded-3xl inline-flex mb-6">
                  <Award className="h-16 w-16 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">{t.getStarted}</h3>
                <p className="text-white/90 mb-8 text-lg leading-relaxed">{t.pleaseLogin}</p>
                <SignInButton mode="modal" forceRedirectUrl="/" signUpForceRedirectUrl="/">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 h-14 text-lg font-semibold elevation-2 transition-elevation hover:elevation-3 rounded-xl px-10"
                  >
                    <User className="mr-3 h-6 w-6" />
                    {t.loginNow}
                  </Button>
                </SignInButton>
              </div>
            </Card>
          </section>
        </SignedOut>

        <SignedIn>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-foreground mb-3 text-balance">{t.aiRecognitionTitle}</h2>
            <p className="text-muted-foreground text-lg text-pretty max-w-md mx-auto">{t.aiRecognitionSubtitle}</p>
          </div>

          <Card className="mb-10 gradient-card border-2 border-border elevation-2 transition-elevation hover:elevation-3 overflow-hidden rounded-2xl">
            <CardContent className="p-0">
              <div
                className={`text-center p-10 transition-all duration-300 ${
                  dragActive ? 'bg-primary/10 border-primary/30 scale-[1.02]' : ''
                } ${uploadStatus === 'uploading' ? 'opacity-50 pointer-events-none' : ''}`}
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

                <h3 className="text-2xl font-bold text-card-foreground mb-3">{t.uploadTitle}</h3>
                <p className="text-muted-foreground mb-10 text-lg max-w-md mx-auto leading-relaxed">
                  {t.uploadSubtitle.split('\n').map((line, index) => (
                    <span key={index}>
                      {line}
                      {index < t.uploadSubtitle.split('\n').length - 1 && <br />}
                    </span>
                  ))}
                </p>

                <div className="flex flex-col gap-4 max-w-xs mx-auto">
                  <Button
                    onClick={openCamera}
                    disabled={uploadStatus === 'uploading'}
                    className="gradient-primary hover:opacity-90 text-primary-foreground h-14 text-lg font-semibold elevation-2 transition-elevation hover:elevation-3 rounded-xl"
                    size="lg"
                  >
                    <Camera className="mr-3 h-6 w-6" />
                    {uploadStatus === 'uploading' ? t.aiProcessing : t.takePhoto}
                  </Button>

                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadStatus === 'uploading'}
                    variant="outline"
                    size="lg"
                    className="border-2 border-primary text-primary hover:bg-primary/5 h-14 text-lg font-medium transition-all duration-200 rounded-xl"
                  >
                    <Upload className="mr-3 h-6 w-6" />
                    {t.selectImage}
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
                  <h3 className="text-xl font-bold text-foreground mb-3">{t.aiRecognitionFeature}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{t.aiRecognitionDesc}</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-card border border-border rounded-2xl">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-accent/10 rounded-2xl flex-shrink-0">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t.smartCategoryFeature}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{t.smartCategoryDesc}</p>
                </div>
              </div>
            </Card>

            <Card className="p-8 elevation-2 transition-elevation hover:elevation-3 gradient-card border border-border rounded-2xl">
              <div className="flex items-start gap-6">
                <div className="p-4 bg-chart-2/10 rounded-2xl flex-shrink-0">
                  <TrendingUp className="h-8 w-8 text-chart-2" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{t.learningAnalysisFeature}</h3>
                  <p className="text-muted-foreground leading-relaxed text-base">{t.learningAnalysisDesc}</p>
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
            <span className="text-xs font-semibold">{t.home}</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground min-w-0 px-4 py-3 h-auto transition-colors rounded-xl hover:bg-primary/5"
          >
            <History className="h-6 w-6" />
            <span className="text-xs font-medium">{t.history}</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground min-w-0 px-4 py-3 h-auto transition-colors rounded-xl hover:bg-primary/5"
          >
            <BarChart3 className="h-6 w-6" />
            <span className="text-xs font-medium">{t.analysis}</span>
          </Button>

          <Button
            variant="ghost"
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-foreground min-w-0 px-4 py-3 h-auto transition-colors rounded-xl hover:bg-primary/5"
          >
            <User className="h-6 w-6" />
            <span className="text-xs font-medium">{t.profile}</span>
          </Button>
        </div>
      </nav>
    </div>
  )
}
