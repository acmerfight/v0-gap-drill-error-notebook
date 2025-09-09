
### 🚀 技术栈

```
Runtime:     Next.js 15 + React 19 + TypeScript 5
UI:          Tailwind CSS 4 + Radix UI + Lucide Icons
Auth:        Clerk Authentication  
Deploy:      Vercel (Node.js 22 target)
Analytics:   Vercel Analytics
Linting:     ESLint 9 + TypeScript ESLint
Package:     pnpm (>=8.0.0, recommended: 10.15.1)
```

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

### 🤖 Claude Code 自动化指令

**⚠️ 重要：Claude Code 需要主动维护文档同步性**

#### 文档同步监控规则
```yaml
watch_files:
  - package.json          # 监控依赖和scripts变更
  - *.config.js|ts       # 监控配置文件变更  
  - .github/workflows/*   # 监控CI/CD变更
  - tsconfig.json        # 监控TypeScript配置

auto_update_triggers:
  - packageManager 字段变更 → 更新技术栈 Package 行
  - engines 字段变更 → 更新技术栈和项目命令  
  - scripts 字段变更 → 更新常用命令列表
  - dependencies 主要框架版本变更 → 更新技术栈 Runtime/UI 行
```

#### Claude Code 执行指令
当检测到上述文件变更时，Claude Code 应该：

1. **立即提醒用户：**
   ```
   🔄 检测到技术栈变更，CLAUDE.md 需要更新
   变更文件: [文件名]
   影响区域: [技术栈/项目命令/等]
   ```

2. **自动分析差异：**
   - 读取变更的配置文件
   - 对比当前CLAUDE.md内容
   - 生成具体的更新建议

3. **提供一键更新：**
   - 显示具体的修改内容
   - 询问用户确认
   - 执行文档更新

#### 同步验证规则
```bash
# Claude Code 应该定期验证这些一致性
package.json.packageManager === CLAUDE.md技术栈.Package ✓
package.json.engines.node === CLAUDE.md技术栈.Deploy ✓  
package.json.scripts.* === CLAUDE.md常用命令 ✓
```

**使用方式：** Claude Code 在执行任何修改 package.json、配置文件的操作后，应该自动运行文档同步检查。

