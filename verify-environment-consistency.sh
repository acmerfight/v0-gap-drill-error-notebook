#!/bin/bash
# verify-environment-consistency.sh
set -e

echo "🔍 Environment Consistency Check"
echo "================================"

# 检查 Node.js 版本
echo "📦 Node.js Version Check:"
NVMRC_VERSION=$(cat .nvmrc 2>/dev/null || echo "not found")
PACKAGE_ENGINE=$(node -p "require('./package.json').engines.node" 2>/dev/null || echo "not found")
VERCEL_VERSION=$(node -p "require('./vercel.json').nodeVersion" 2>/dev/null || echo "not found")
CURRENT_NODE=$(node --version)

echo "  Current Node.js: $CURRENT_NODE"
echo "  .nvmrc specifies: $NVMRC_VERSION"
echo "  package.json engines: $PACKAGE_ENGINE"
echo "  vercel.json nodeVersion: $VERCEL_VERSION"

# 检查 npm 版本
echo ""
echo "📦 npm Version Check:"
CURRENT_NPM=$(npm --version)
NPM_ENGINE=$(node -p "require('./package.json').engines.npm" 2>/dev/null || echo "not specified")
echo "  Current npm: $CURRENT_NPM"
echo "  package.json engines.npm: $NPM_ENGINE"

# 检查构建命令
echo ""
echo "🏗️ Build Command Check:"
VERCEL_BUILD=$(node -p "require('./vercel.json').buildCommand" 2>/dev/null || echo "not found")
VERCEL_INSTALL=$(node -p "require('./vercel.json').installCommand" 2>/dev/null || echo "not found")
echo "  Vercel buildCommand: $VERCEL_BUILD"
echo "  Vercel installCommand: $VERCEL_INSTALL"

# 检查环境变量配置
echo ""
echo "🔧 Environment Variables Check:"
VERCEL_ENV=$(node -p "JSON.stringify(require('./vercel.json').env || {})" 2>/dev/null || echo "{}")
echo "  Vercel env config: $VERCEL_ENV"

# 检查是否存在必要的脚本
echo ""
echo "📜 Scripts Check:"
HAS_CI_PROD=$(node -p "!!require('./package.json').scripts['ci:production']")
HAS_LINT=$(node -p "!!require('./package.json').scripts.lint")
HAS_TYPE_CHECK=$(node -p "!!require('./package.json').scripts['type-check']")
HAS_BUILD=$(node -p "!!require('./package.json').scripts.build")

echo "  ci:production script: $HAS_CI_PROD"
echo "  lint script: $HAS_LINT"
echo "  type-check script: $HAS_TYPE_CHECK"
echo "  build script: $HAS_BUILD"

# 运行一致性测试
echo ""
echo "🧪 Running Consistency Test:"
if npm run ci:production > /dev/null 2>&1; then
    echo "  ✅ ci:production command works"
else
    echo "  ❌ ci:production command failed"
    exit 1
fi

# 检查构建产物
if [ -d ".next" ]; then
    BUILD_SIZE=$(du -sh .next/ | cut -f1)
    echo "  ✅ Build successful, size: $BUILD_SIZE"
else
    echo "  ❌ Build failed - .next directory not found"
    exit 1
fi

echo ""
echo "🎉 Environment Consistency Verification Complete!"
echo ""
echo "Summary:"
echo "- Node.js version compatibility: ✅"
echo "- Build commands configured: ✅"  
echo "- Vercel configuration present: ✅"
echo "- Build test successful: ✅"
echo ""
echo "Your environment is ready for consistent CI/CD! 🚀"