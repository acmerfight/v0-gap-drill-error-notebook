#!/bin/bash
# verify-ci-optimization.sh
set -e

echo "🔍 CI Optimization Verification"
echo "==============================="

# 检查 CI 触发器
echo "📋 CI Trigger Configuration:"
TRIGGERS=$(grep -A 5 "^on:" .github/workflows/ci.yml | grep -v "^--")
echo "$TRIGGERS"

# 检查是否移除了 push 触发器
if grep -q "push:" .github/workflows/ci.yml; then
    echo "❌ push 触发器仍然存在"
    exit 1
else
    echo "✅ push 触发器已移除 - 避免合并后重复执行"
fi

# 检查是否保留了 PR 触发器
if grep -q "pull_request:" .github/workflows/ci.yml; then
    echo "✅ pull_request 触发器保留 - PR 质量门正常"
else
    echo "❌ pull_request 触发器缺失"
    exit 1
fi

echo ""
echo "🏗️ Build Command Check:"

# 检查是否使用了新的 ci:production 命令
if grep -q "npm run ci:production" .github/workflows/ci.yml; then
    echo "✅ 使用 npm run ci:production - 镜像 Vercel 环境"
else
    echo "❌ 未使用 ci:production 命令"
    exit 1
fi

# 检查 vercel.json 配置是否匹配
echo ""
echo "🔄 Environment Consistency Check:"
CI_BUILD_CMD=$(grep "run: npm run" .github/workflows/ci.yml | tail -1 | sed 's/.*run: //')
VERCEL_BUILD_CMD=$(node -p "require('./vercel.json').buildCommand")

echo "  CI build command: $CI_BUILD_CMD"
echo "  Vercel build command: $VERCEL_BUILD_CMD"

if [ "$CI_BUILD_CMD" = "$VERCEL_BUILD_CMD" ]; then
    echo "✅ 构建命令完全一致"
else
    echo "❌ 构建命令不一致"
    exit 1
fi

# 检查 Node.js 版本一致性
CI_NODE_VERSION=$(grep "NODE_VERSION:" .github/workflows/ci.yml | awk -F"'" '{print $2}')
VERCEL_NODE_VERSION=$(node -p "require('./vercel.json').nodeVersion")

echo ""
echo "📦 Node.js Version Check:"
echo "  CI Node.js: $CI_NODE_VERSION"
echo "  Vercel Node.js: $VERCEL_NODE_VERSION"

if [ "$CI_NODE_VERSION" = "$VERCEL_NODE_VERSION" ]; then
    echo "✅ Node.js 版本完全一致"
else
    echo "❌ Node.js 版本不一致"
    exit 1
fi

echo ""
echo "🎉 CI Optimization Verification Complete!"
echo ""
echo "Summary:"
echo "- ✅ 移除了合并后的重复执行"
echo "- ✅ 保留了 PR 阶段的完整验证"  
echo "- ✅ 构建命令与 Vercel 完全一致"
echo "- ✅ Node.js 版本镜像配置正确"
echo ""
echo "新的 CI/CD 流程已优化: PR验证 → 分支保护 → Vercel部署 🚀"