## 🚨 Core Principle: Documentation-Project Synchronization

**Any changes to project architecture, technology stack, or engineering practices must be immediately reflected in this document and related documentation.**

Documentation inconsistencies lead to reduced development efficiency and poor decision-making. Maintaining documentation accuracy is every contributor's responsibility.

---

### 🚀 Tech Stack

```
Runtime:     Next.js 15 + React 19 + TypeScript 5
UI:          Tailwind CSS 4 + Radix UI + Lucide Icons
Auth:        Clerk Authentication
Database:    Neon PostgreSQL + Drizzle ORM
Deploy:      Vercel (Node.js 22 target)
Analytics:   Vercel Analytics
Storage:     Vercel Blob
Validation:  Zod
Linting:     ESLint 9 + TypeScript ESLint + Prettier
Git Hooks:   Husky + lint-staged
Package:     pnpm (>=8.0.0, recommended: 10.15.1)
```

### 🌐 Deployment & Environment

This project is based on **Vercel** and **GitHub** integrated architecture, adopting a modern cloud-native deployment approach:

- 🔗 **Integration**: GitHub + Vercel + Neon three-way integration
- 🔧 **Environment Variables**: All environment variables are managed through Vercel platform, no local configuration needed
- 📊 **Project Information**: Use `vercel`, `gh`, `neon` CLI tools to retrieve project status and configuration
- ⚠️ **Important**: Do not manually set environment variables or retrieve configuration through other means, use Vercel platform exclusively

### 🐙 GitHub CLI Operations

Use **GitHub CLI (`gh`)** for repository operations and workflows:

```bash
# Repository Management
gh repo view                    # View repository details
gh repo sync                    # Sync forked repository with upstream

# Pull Request Workflow
gh pr create                    # Create a new pull request
gh pr list                      # List pull requests
gh pr view [number]             # View PR details
gh pr checkout [number]         # Checkout PR locally
gh pr review [number]           # Review a pull request
gh pr merge [number]            # Merge a pull request

# Issue Management
gh issue create                 # Create a new issue
gh issue list                   # List issues
gh issue view [number]          # View issue details

# Branch Operations
gh pr create --base main --head feature-branch
gh pr checks                    # View PR CI/CD status

# Workflow & Actions
gh run list                     # List workflow runs
gh run view [run-id]            # View workflow run details
gh run watch                    # Watch a workflow run in real-time
```

**Best Practices**:

- Always create PRs via `gh pr create` for consistency
- Review PR checks before merging: `gh pr checks`
- Use `gh pr view` to verify all checks pass before approval

### 🛠️ Project Commands

Use **pnpm** to run project commands, see `scripts` field in `package.json` for details

Common commands:

```bash
# Development
pnpm dev          # Development mode
pnpm build        # Build project
pnpm start        # Production mode

# Code Quality
pnpm lint:fix     # Auto-fix ESLint + Prettier formatting issues
pnpm lint:check   # Check code format (no auto-fix, CI mode)
pnpm type-check   # TypeScript type checking

# CI/CD
pnpm ci           # Complete CI pipeline (lint + type-check + build)
pnpm health       # Project health check (type-check + lint:check)

# Maintenance
pnpm clean        # Clean build cache
pnpm clean:deps   # Clean dependencies and reinstall
```

### 🔒 Code Quality & Security

**Strict code quality standards**:

- 🚫 **No bypassing checks**: `git commit --no-verify` is strictly prohibited
- 🔍 **ESLint security rules**: Enforce security and async safety rules
- 📏 **TypeScript strict mode**: Ensure type safety
- 🪝 **Pre-commit hooks**: Husky + lint-staged automatically runs ESLint, TypeScript compilation, and Prettier checks

**Git workflow standards**:

- 🚫 **Strictly no direct push to main**: All code must be submitted via Pull Request
- 🛡️ **No exceptions**: All developers including administrators must follow this standard

### 🧠 Core Principles (The Rule)

```
Errors should never pass silently
Types over runtime assumptions
Composition over inheritance
Explicit over implicit magic
In the face of ambiguity, refuse to guess
There should be one obvious way to do it
If the implementation is hard to explain, it's a bad idea
```

### 📁 Project Structure

```
/app                 # Next.js 15 App Router pages and layouts
  /api              # API routes
/components          # React components
  /ui               # Reusable base UI components (shadcn/ui)
/lib                # Utility functions, configuration and common logic
  schema.ts         # Drizzle ORM database schema
  db.ts             # Database connection configuration
/types              # TypeScript type definitions
/styles             # Global style files
/public             # Static assets
middleware.ts       # Next.js middleware (auth, i18n, etc.)
drizzle.config.ts   # Drizzle ORM configuration
```
