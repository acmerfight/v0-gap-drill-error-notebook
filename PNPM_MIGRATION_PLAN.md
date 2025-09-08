# 🚨 紧急：npm → pnpm 迁移执行计划

## 📋 迁移概述

**优先级**：🔴 P0 - 安全关键  
**预计耗时**：2-3 小时  
**影响范围**：开发环境、CI/CD、部署流程  
**风险等级**：低（可回滚）

## 🚨 迁移驱动因素

### 安全漏洞危机
当前项目存在 **30 个关键安全漏洞**：
```
- color-convert (恶意软件)
- color-name (恶意软件)  
- debug (恶意软件)
- 整个 ESLint 生态链被污染
- Next.js 构建管道供应链风险
```

### pnpm 隔离优势
- ✅ **依赖隔离**：防止幽灵依赖和供应链攻击
- ✅ **性能提升**：安装速度提升 2-3x，磁盘占用减少 40-50%
- ✅ **严格模式**：符合项目 "显式胜于魔法" 原则

## 📅 分阶段执行计划

### Phase 0: 准备阶段 (15min)

**0.1 环境备份**
```bash
# 创建迁移分支
git checkout -b feat/pnpm-migration

# 备份当前状态
git stash push -m "pre-migration-backup"
cp package-lock.json package-lock.json.backup
cp -r node_modules node_modules.backup 2>/dev/null || true
```

**0.2 pnpm 安装**
```bash
# 全局安装 pnpm
npm install -g pnpm@latest

# 验证安装
pnpm --version
```

### Phase 1: 清理与迁移 (30min)

**1.1 彻底清理**
```bash
# 删除被污染的依赖
rm -rf node_modules
rm -f package-lock.json
rm -rf .next
rm -rf node_modules/.cache
```

**1.2 pnpm 初始化**
```bash
# 重新安装依赖
pnpm install

# 生成 pnpm-lock.yaml
ls -la pnpm-lock.yaml
```

### Phase 2: 配置更新 (45min)

**2.1 package.json 更新**
```json
{
  "engines": {
    "node": "22.x",
    "npm": ">=10.0.0",
    "pnpm": ">=8.0.0"
  },
  "scripts": {
    "clean:deps": "npx rimraf node_modules pnpm-lock.yaml && pnpm install"
  }
}
```

**2.2 Vercel 配置更新**
```json
{
  "buildCommand": "pnpm run type-check && pnpm run build",
  "installCommand": "pnpm install --frozen-lockfile"
}
```

**2.3 项目文档更新**
- 更新 CLAUDE.md 技术栈说明
- 更新 README.md 安装指南（如存在）

### Phase 3: CI/CD 适配 (30min)

**3.1 GitHub Actions (如存在)**
```yaml
- name: Setup pnpm
  uses: pnpm/action-setup@v2
  with:
    version: 8

- name: Install dependencies  
  run: pnpm install --frozen-lockfile
```

**3.2 其他 CI 配置**
- 检查并更新所有 CI 配置文件
- 确保使用 pnpm 命令替代 npm

### Phase 4: 验证与测试 (60min)

**4.1 依赖健康检查**
```bash
# 检查依赖完整性
pnpm list

# 安全审计
pnpm audit --audit-level moderate

# 检查过期依赖
pnpm outdated
```

**4.2 构建流程验证**
```bash
# 完整 CI 流程测试
pnpm run ci:check

# 各项检查
pnpm run lint
pnpm run type-check  
pnpm run build
```

**4.3 开发环境测试**
```bash
# 启动开发服务器
pnpm run dev

# 验证热重载功能
# 验证所有页面正常加载
```

## 🔄 回滚策略

如遇到不可解决的问题：

```bash
# 恢复原状态
git stash pop
cp package-lock.json.backup package-lock.json
rm -rf node_modules pnpm-lock.yaml
npm ci --frozen-lockfile
```

## 📊 验收标准

### 必要条件 ✅
- [ ] 所有依赖正确安装
- [ ] `pnpm audit` 无关键漏洞
- [ ] `pnpm run ci:check` 通过
- [ ] 开发服务器正常启动
- [ ] 构建产物正常生成

### 性能指标 📈
- [ ] `pnpm install` < 30秒（vs npm ~60秒）
- [ ] `node_modules` < 350MB（vs npm 557MB）
- [ ] 构建时间无显著增加

### 配置完整性 🔧  
- [ ] `vercel.json` 已更新
- [ ] `package.json` engines 已更新
- [ ] 项目文档已同步
- [ ] CI/CD 配置已适配

## 🚀 部署计划

### 开发环境
- 立即执行迁移
- 团队成员同步更新本地环境

### 生产环境  
- Vercel 自动检测配置变更
- 下次部署时自动使用 pnpm

## 📝 团队协作

### 新成员入职
```bash
# 克隆项目后
git clone <repo>
cd <project>

# 安装 pnpm（如未安装）
npm install -g pnpm

# 安装依赖
pnpm install

# 启动开发
pnpm run dev
```

### 常用命令映射
| npm 命令 | pnpm 等价 |
|----------|-----------|
| `npm install` | `pnpm install` |
| `npm run dev` | `pnpm run dev` |
| `npm run build` | `pnpm run build` |
| `npm audit fix` | `pnpm audit --fix` |

## 🎯 迁移后优化

### 短期 (1周内)
- [ ] 团队培训 pnpm 用法
- [ ] 监控构建性能指标  
- [ ] 收集团队反馈

### 中期 (1月内)
- [ ] 评估 Monorepo 工作空间需求
- [ ] 优化 pnpm 配置
- [ ] 建立最佳实践文档

---

## ⚠️ 重要提醒

1. **备份优先**：执行前务必备份当前状态
2. **团队同步**：确保所有团队成员了解变更
3. **验证充分**：每个阶段都要验证成功再继续
4. **文档及时**：及时更新项目文档和 README

**迁移负责人**：Claude Code  
**审核人员**：项目技术负责人  
**紧急联系**：遇到问题立即回滚并寻求支持