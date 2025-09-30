/**
 * Global type definitions for the application
 */

declare global {
  interface Window {
    MathJax?: {
      typesetPromise?: () => Promise<void>
      startup?: {
        defaultReady: () => void
        document: {
          menu: {
            settings: {
              renderer: string
            }
          }
        }
      }
      tex?: {
        inlineMath?: [string, string][]
        displayMath?: [string, string][]
        processEscapes?: boolean
        processEnvironments?: boolean
      }
      options?: {
        skipHtmlTags?: string[]
        ignoreHtmlClass?: string
        processHtmlClass?: string
      }
    }
  }
}

export {}
