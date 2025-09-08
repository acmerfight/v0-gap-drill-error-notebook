
### 🧠 核心原则 (The Rule)

```
错误应该显式处理，永远不要静默忽略 - Errors should never pass silently
类型安全胜于运行时猜测 - Types over runtime assumptions
组合优于继承 - Composition over inheritance  
显式声明胜于魔法推导 - Explicit over implicit magic
简单优于复杂，复杂优于混乱 - Simple over complex, complex over chaotic
扁平优于嵌套，但抽象要有层次 - Flat over nested, but abstractions need layers
可预测性是美德 - Predictability is a virtue
面对歧义时，拒绝猜测的诱惑 - In the face of ambiguity, refuse to guess
应该有一种明显的方式来做一件事 - There should be one obvious way to do it
如果实现很难解释，那就是个坏想法 - If the implementation is hard to explain, it's a bad idea
```

### 📁 项目结构

如果项目结构有任何变更，必须更新此部分为最新
```
/app                 # Next.js 13+ App Router
/components
  /ui               # 基础 UI 组件 (Button, Input)
  /feature          # 业务组件 (UserProfile, ProductCard)
/lib                # 工具函数和配置
  /utils.ts         # 通用工具函数
  /types.ts         # 全局类型定义
  /constants.ts     # 常量定义
/hooks              # 自定义 React Hooks
/styles             # 全局样式和 Tailwind 配置
```

