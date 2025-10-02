export interface Translations {
  // Header
  appName: string
  appSubtitle: string

  // Authentication
  welcomeTitle: string
  welcomeSubtitle: string
  getStarted: string
  pleaseLogin: string
  loginNow: string

  // Core business value proposition texts
  heroTitle: string
  heroSubtitle: string
  coreValueTitle: string
  coreValueDesc: string
  howItWorksTitle: string
  step1Title: string
  step1Desc: string
  step2Title: string
  step2Desc: string
  step3Title: string
  step3Desc: string
  whyChooseTitle: string
  aiPoweredTitle: string
  aiPoweredDesc: string
  targetedLearningTitle: string
  targetedLearningDesc: string
  efficientPracticeTitle: string
  efficientPracticeDesc: string

  // Main content
  aiRecognitionTitle: string
  aiRecognitionSubtitle: string
  uploadTitle: string
  uploadSubtitle: string
  takePhoto: string
  selectImage: string
  aiProcessing: string

  // Features
  aiRecognitionFeature: string
  aiRecognitionDesc: string
  smartCategoryFeature: string
  smartCategoryDesc: string
  learningAnalysisFeature: string
  learningAnalysisDesc: string

  // Navigation
  home: string
  history: string
  analysis: string
  profile: string

  // Status messages
  recognizing: string
  recognitionSuccess: string
  recognitionFailed: string
  loadingApp: string

  // Recognition result page
  recognitionResult: string
  originalImage: string
  questionContent: string
  solutionProcess: string
  edit: string
  preview: string
  save: string
  saveToLibrary: string
  saving: string
  saveSuccess: string
  confirmResult: string
  confirmResultDesc: string
  markdownSupport: string
  markdownSyntax: string
  noSolutionFound: string
  aiRecognizing: string
  pleaseWait: string
}

export const translations: Record<string, Translations> = {
  zh: {
    appName: 'GapDrill',
    appSubtitle: 'AI智能错题本',

    welcomeTitle: '欢迎使用 GapDrill',
    welcomeSubtitle: 'AI驱动的智能错题管理系统\n让学习更高效，进步更明显',
    getStarted: '开始使用',
    pleaseLogin: '请先登录账户，即可开始使用AI智能错题识别功能',
    loginNow: '立即登录',

    heroTitle: '改进教学，让学习更有针对性',
    heroSubtitle: '基于超强AI技术，收集分析错题，解析真正不会的知识点，生成针对性练习题，告别无效练习',
    coreValueTitle: '核心价值',
    coreValueDesc:
      '我们的目标是改进现在的教学方式，让学生进行针对性学习，不再进行大量无效的练习。通过AI分析错题，精准定位知识薄弱点，提供个性化学习方案。',
    howItWorksTitle: '工作原理',
    step1Title: '收集错题',
    step1Desc: '拍照或上传错题图片，AI自动识别题目内容和解题过程',
    step2Title: '智能分析',
    step2Desc: 'AI深度分析错题，识别真正不会的知识点和薄弱环节',
    step3Title: '针对性练习',
    step3Desc: '根据分析结果生成个性化练习题，精准提升学习效果',
    whyChooseTitle: '为什么选择我们',
    aiPoweredTitle: '超强AI技术',
    aiPoweredDesc: '采用最先进的人工智能技术，识别准确率高达95%以上，支持手写和印刷体',
    targetedLearningTitle: '针对性学习',
    targetedLearningDesc: '精准分析知识薄弱点，避免盲目刷题，让每次练习都有针对性',
    efficientPracticeTitle: '高效练习',
    efficientPracticeDesc: '告别大量无效练习，专注于真正需要提升的知识点，学习效率翻倍',

    aiRecognitionTitle: 'AI智能错题识别',
    aiRecognitionSubtitle: '拍照上传错题，AI瞬间识别，学习效率翻倍',
    uploadTitle: '上传错题图片',
    uploadSubtitle: '拖拽图片到此处，或点击下方按钮\n支持手写和印刷体，识别准确率95%+',
    takePhoto: '拍照识别',
    selectImage: '选择图片',
    aiProcessing: 'AI识别中...',

    aiRecognitionFeature: 'AI智能识别',
    aiRecognitionDesc: '先进的OCR技术结合深度学习，自动识别图片中的文字和数学公式，支持手写和印刷体，准确率高达95%以上',
    smartCategoryFeature: '智能分类整理',
    smartCategoryDesc: '自动按学科、难度、错误类型分类整理错题，建立个人专属错题库，支持智能标签和快速搜索功能',
    learningAnalysisFeature: '学习分析报告',
    learningAnalysisDesc: '深度分析学习薄弱点和进步趋势，提供个性化学习建议和科学复习计划，让每次学习都更有针对性',

    home: '首页',
    history: '历史',
    analysis: '分析',
    profile: '我的',

    recognizing: 'AI正在识别中...',
    recognitionSuccess: '识别成功！正在跳转...',
    recognitionFailed: '识别失败，请重试',
    loadingApp: '正在加载应用...',

    recognitionResult: '识别结果',
    originalImage: '原图',
    questionContent: '题目内容',
    solutionProcess: '解题过程',
    edit: '编辑',
    preview: '预览',
    save: '保存',
    saveToLibrary: '保存到错题库',
    saving: '保存中...',
    saveSuccess: '保存成功！',
    confirmResult: '确认识别结果',
    confirmResultDesc:
      '支持Markdown语法和MathJax数学公式渲染。请仔细检查AI识别的内容是否正确，如有错误可点击编辑按钮修改。确认无误后点击保存到错题库。',
    markdownSupport: 'Markdown语法支持',
    markdownSyntax: '**粗体**、*斜体*、`代码`、数学公式 $x^2$ 或 $$\\frac{1}{2}$$',
    noSolutionFound: '未识别到解题过程',
    aiRecognizing: 'AI正在识别中',
    pleaseWait: '请稍候，正在分析您的错题图片...',
  },

  en: {
    appName: 'GapDrill',
    appSubtitle: 'AI Smart Error Notebook',

    welcomeTitle: 'Welcome to GapDrill',
    welcomeSubtitle: 'AI-powered intelligent error management system\nMake learning more efficient and progress more visible',
    getStarted: 'Get Started',
    pleaseLogin: 'Please log in to start using AI smart error recognition',
    loginNow: 'Login Now',

    heroTitle: 'Improve Teaching, Make Learning More Targeted',
    heroSubtitle:
      'Powered by advanced AI technology, collect and analyze errors, identify real knowledge gaps, generate targeted exercises, say goodbye to ineffective practice',
    coreValueTitle: 'Core Value',
    coreValueDesc:
      'Our goal is to improve current teaching methods, enabling students to learn in a targeted way without massive ineffective practice. Through AI error analysis, we precisely locate knowledge weaknesses and provide personalized learning solutions.',
    howItWorksTitle: 'How It Works',
    step1Title: 'Collect Errors',
    step1Desc: 'Take photos or upload error images, AI automatically recognizes question content and solution process',
    step2Title: 'Smart Analysis',
    step2Desc: 'AI deeply analyzes errors, identifies real knowledge gaps and weak points',
    step3Title: 'Targeted Practice',
    step3Desc: 'Generate personalized exercises based on analysis results, precisely improve learning effectiveness',
    whyChooseTitle: 'Why Choose Us',
    aiPoweredTitle: 'Advanced AI Technology',
    aiPoweredDesc:
      'Using cutting-edge artificial intelligence technology with 95%+ recognition accuracy, supporting both handwriting and print',
    targetedLearningTitle: 'Targeted Learning',
    targetedLearningDesc: 'Precisely analyze knowledge weaknesses, avoid blind practice, make every exercise targeted',
    efficientPracticeTitle: 'Efficient Practice',
    efficientPracticeDesc:
      'Say goodbye to massive ineffective practice, focus on knowledge points that really need improvement, double learning efficiency',

    aiRecognitionTitle: 'AI Smart Error Recognition',
    aiRecognitionSubtitle: 'Take photos to upload errors, AI recognizes instantly, double learning efficiency',
    uploadTitle: 'Upload Error Image',
    uploadSubtitle: 'Drag image here, or click button below\nSupports handwriting and print, 95%+ accuracy',
    takePhoto: 'Take Photo',
    selectImage: 'Select Image',
    aiProcessing: 'AI Processing...',

    aiRecognitionFeature: 'AI Smart Recognition',
    aiRecognitionDesc:
      'Advanced OCR technology combined with deep learning, automatically recognizes text and mathematical formulas in images, supports handwriting and print, with accuracy up to 95%',
    smartCategoryFeature: 'Smart Classification',
    smartCategoryDesc:
      'Automatically classify and organize errors by subject, difficulty, and error type, build personal error library with smart tags and quick search',
    learningAnalysisFeature: 'Learning Analysis Report',
    learningAnalysisDesc:
      'Deep analysis of learning weaknesses and progress trends, provide personalized learning suggestions and scientific review plans for more targeted learning',

    home: 'Home',
    history: 'History',
    analysis: 'Analysis',
    profile: 'Profile',

    recognizing: 'AI is recognizing...',
    recognitionSuccess: 'Recognition successful! Redirecting...',
    recognitionFailed: 'Recognition failed, please try again',
    loadingApp: 'Loading application...',

    recognitionResult: 'Recognition Result',
    originalImage: 'Original Image',
    questionContent: 'Question Content',
    solutionProcess: 'Solution Process',
    edit: 'Edit',
    preview: 'Preview',
    save: 'Save',
    saveToLibrary: 'Save to Library',
    saving: 'Saving...',
    saveSuccess: 'Saved successfully!',
    confirmResult: 'Confirm Recognition Result',
    confirmResultDesc:
      'Supports Markdown syntax and MathJax mathematical formula rendering. Please carefully check if the AI recognition content is correct. If there are errors, click the Edit button to modify. Click Save to Library after confirmation.',
    markdownSupport: 'Markdown Syntax Support',
    markdownSyntax: '**Bold**, *Italic*, `Code`, Math formulas $x^2$ or $$\\frac{1}{2}$$',
    noSolutionFound: 'No solution process found',
    aiRecognizing: 'AI is recognizing',
    pleaseWait: 'Please wait, analyzing your error image...',
  },
}

// 检测用户语言偏好
export function detectLanguage(userInput?: string): 'zh' | 'en' {
  // 如果提供了用户输入，检测输入语言
  if (userInput) {
    const chineseRegex = /[\u4e00-\u9fff]/
    if (chineseRegex.test(userInput)) {
      return 'zh'
    }
    return 'en'
  }

  // 检测浏览器语言
  if (typeof window !== 'undefined') {
    const browserLang = navigator.language || navigator.languages?.[0] || 'en'
    if (browserLang.startsWith('zh')) {
      return 'zh'
    }
  }

  return 'en'
}

// 获取翻译文本
export function getTranslations(lang: 'zh' | 'en' = 'zh'): Translations {
  return translations[lang] || translations.zh
}
