### 🚀 技术栈

```
Runtime:     Next.js 15 + React 19 + TypeScript 5
UI:          Tailwind CSS 4 + Radix UI + Lucide Icons
Auth:        Clerk Authentication
Deploy:      Vercel (Node.js 22 target)
Analytics:   Vercel Analytics
Linting:     ESLint 9 + TypeScript ESLint
Package:     pnpm (>=8.0.0, recommended: 10.15.1)
Storage:     neon, 可使用 Neon CLI
```

### 🌐 部署与环境

本项目基于 **Vercel** 和 **GitHub** 集成架构，采用现代化的云原生部署方案：

- 🔗 **集成方案**: GitHub + Vercel + Neon 三方集成
- 🔧 **环境变量管理**: 所有环境变量均通过 Vercel 平台统一管理，无需本地配置
- 📊 **项目信息获取**: 可通过 `vercel`, `gh`, `neon` CLI 工具获取项目状态和配置信息
- ⚠️ **重要提醒**: 请勿手动设置环境变量或通过其他方式获取配置，统一使用 Vercel 平台管理

### 🛠️ 项目命令

使用 **pnpm** 运行项目命令，详见 `package.json` 中的 `scripts` 字段

常用命令：

```bash
pnpm dev          # 开发模式
pnpm build        # 构建项目
pnpm ci           # CI检查 (lint + type-check + build)
pnpm lint:fix     # 修复代码格式
pnpm type-check   # TypeScript类型检查
```

### 🔒 代码质量与安全

**严格执行代码质量标准**：

- 🚫 **禁止绕过检查**: `git commit --no-verify` 被严格禁止
- 🔍 **ESLint 安全规则**: 强制执行安全和异步安全规则
- 📏 **TypeScript 严格模式**: 确保类型安全

**Git 工作流规范**：

- 🚫 **严格禁止直接 push main**: 所有代码必须使用 Pull Request 方式提交
- 🛡️ **无例外原则**: 包括管理员在内的所有开发者必须遵守此规范

### 🧠 核心原则 (The Rule)

```
错误应该显式处理，永远不要静默忽略 - Errors should never pass silently
类型安全胜于运行时猜测 - Types over runtime assumptions
组合优于继承 - Composition over inheritance
显式声明胜于魔法推导 - Explicit over implicit magic
面对歧义时，拒绝猜测的诱惑 - In the face of ambiguity, refuse to guess
应该有一种明显的方式来做一件事 - There should be one obvious way to do it
如果实现很难解释，那就是个坏想法 - If the implementation is hard to explain, it's a bad idea
```

### 📁 项目结构

**⚠️ 重要：任何项目结构变更都必须同步更新此文档**

```
/app                 # Next.js 13+ App Router 页面和布局
/components          # React 组件
  /ui               # 可复用基础 UI 组件
/lib                # 工具函数、配置和通用逻辑
/types              # TypeScript 类型定义
/styles             # 全局样式文件
/public             # 静态资源
```
