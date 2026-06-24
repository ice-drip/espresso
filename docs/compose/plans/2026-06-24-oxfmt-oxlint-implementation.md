# oxfmt 和 oxlint 集成实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为项目添加 oxfmt（代码格式化）和 oxlint（代码 lint）工具，提供自动化的代码质量检查

**Architecture:** 在根目录和 espresso 包中添加 oxfmt 和 oxlint 配置，创建相应的 npm 脚本，保留现有的 TypeScript 类型检查

**Tech Stack:** oxfmt, oxlint, TypeScript, pnpm

---

### Task 1: 安装 oxfmt 和 oxlint 依赖

**Covers:** [S3]

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 检查 oxfmt 和 oxlint 的最新版本**

Run: `npm view oxfmt version && npm view oxlint version`
Expected: 显示最新版本号

- [ ] **Step 2: 安装 oxfmt 和 oxlint 作为 devDependencies**

Run: `pnpm add -D -w oxfmt oxlint`
Expected: 依赖安装成功，package.json 更新

- [ ] **Step 3: 验证安装**

Run: `pnpm list oxfmt oxlint`
Expected: 显示已安装的 oxfmt 和 oxlint 版本

- [ ] **Step 4: 提交更改**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add oxfmt and oxlint dependencies"
```

### Task 2: 创建 oxfmt 配置文件

**Covers:** [S4]

**Files:**
- Create: `.oxfmtrc.json`

- [ ] **Step 1: 创建 .oxfmtrc.json 配置文件**

```json
{
  "indentStyle": "space",
  "indentWidth": 2,
  "lineWidth": 100,
  "quoteStyle": "double",
  "semicolons": "always",
  "arrowParens": "always",
  "trailingComma": "all",
  "bracketSpacing": true,
  "singleQuote": false
}
```

- [ ] **Step 2: 验证配置文件**

Run: `cat .oxfmtrc.json`
Expected: 显示配置文件内容

- [ ] **Step 3: 提交更改**

```bash
git add .oxfmtrc.json
git commit -m "chore: add oxfmt configuration"
```

### Task 3: 创建 oxlint 配置文件

**Covers:** [S4]

**Files:**
- Create: `.oxlintrc.json`

- [ ] **Step 1: 创建 .oxlintrc.json 配置文件**

```json
{
  "plugins": ["typescript"],
  "categories": {
    "correctness": "error",
    "suspicious": "warn"
  },
  "rules": {
    "no-unused-vars": "error",
    "no-debugger": "error",
    "no-duplicate-case": "error",
    "no-empty": "error",
    "no-unreachable": "error",
    "eqeqeq": "error",
    "no-var": "error",
    "prefer-const": "error"
  },
  "ignorePatterns": ["node_modules", "dist"]
}
```

- [ ] **Step 2: 验证配置文件**

Run: `cat .oxlintrc.json`
Expected: 显示配置文件内容

- [ ] **Step 3: 提交更改**

```bash
git add .oxlintrc.json
git commit -m "chore: add oxlint configuration"
```

### Task 4: 修改根目录 package.json 添加脚本

**Covers:** [S3]

**Files:**
- Modify: `package.json`

- [ ] **Step 1: 读取当前的 package.json**

Run: `cat package.json`
Expected: 显示当前 package.json 内容

- [ ] **Step 2: 修改 package.json 添加脚本**

将 `scripts` 部分更新为：
```json
{
  "scripts": {
    "build": "cd packages/espresso && pnpm build",
    "test": "cd packages/test && pnpm test",
    "lint": "cd packages/espresso && pnpm lint",
    "format": "oxfmt --write .",
    "format:check": "oxfmt --check .",
    "lint:oxlint": "oxlint .",
    "lint:fix": "oxlint --fix .",
    "typecheck": "tsc --noEmit"
  }
}
```

- [ ] **Step 3: 验证脚本添加**

Run: `pnpm run format --help`
Expected: 显示 oxfmt 帮助信息

- [ ] **Step 4: 提交更改**

```bash
git add package.json
git commit -m "feat: add oxfmt and oxlint scripts to root package.json"
```

### Task 5: 修改 packages/espresso/package.json 添加脚本

**Covers:** [S3]

**Files:**
- Modify: `packages/espresso/package.json`

- [ ] **Step 1: 读取当前的 packages/espresso/package.json**

Run: `cat packages/espresso/package.json`
Expected: 显示当前 package.json 内容

- [ ] **Step 2: 修改 packages/espresso/package.json 添加脚本**

将 `scripts` 部分更新为：
```json
{
  "scripts": {
    "build": "rslib build",
    "lint": "tsc --noEmit",
    "format": "oxfmt --write .",
    "format:check": "oxfmt --check .",
    "lint:oxlint": "oxlint .",
    "lint:fix": "oxlint --fix ."
  }
}
```

- [ ] **Step 3: 验证脚本添加**

Run: `cd packages/espresso && pnpm run format --help`
Expected: 显示 oxfmt 帮助信息

- [ ] **Step 4: 提交更改**

```bash
git add packages/espresso/package.json
git commit -m "feat: add oxfmt and oxlint scripts to espresso package"
```

### Task 6: 测试 oxfmt 格式化功能

**Covers:** [S7]

**Files:**
- Test: 运行 oxfmt 命令

- [ ] **Step 1: 运行 oxfmt 格式化检查**

Run: `pnpm run format:check`
Expected: 显示需要格式化的文件列表或显示所有文件已格式化

- [ ] **Step 2: 运行 oxfmt 格式化**

Run: `pnpm run format`
Expected: 格式化所有文件，无错误输出

- [ ] **Step 3: 验证格式化结果**

Run: `git status`
Expected: 显示格式化后的文件更改

- [ ] **Step 4: 提交格式化更改**

```bash
git add .
git commit -m "style: format code with oxfmt"
```

### Task 7: 测试 oxlint lint 功能

**Covers:** [S7]

**Files:**
- Test: 运行 oxlint 命令

- [ ] **Step 1: 运行 oxlint 检查**

Run: `pnpm run lint:oxlint`
Expected: 显示 lint 错误和警告列表

- [ ] **Step 2: 分析 lint 结果**

检查输出中的错误和警告，确定需要修复的问题

- [ ] **Step 3: 运行 oxlint 自动修复**

Run: `pnpm run lint:fix`
Expected: 自动修复可修复的问题

- [ ] **Step 4: 再次运行 oxlint 检查**

Run: `pnpm run lint:oxlint`
Expected: 错误数量减少或为零

- [ ] **Step 5: 提交修复更改**

```bash
git add .
git commit -m "fix: fix lint errors found by oxlint"
```

### Task 8: 验证与现有工具的兼容性

**Covers:** [S7]

**Files:**
- Test: 运行现有命令

- [ ] **Step 1: 运行 TypeScript 类型检查**

Run: `pnpm run typecheck`
Expected: 类型检查通过，无错误

- [ ] **Step 2: 运行测试**

Run: `pnpm test`
Expected: 所有测试通过

- [ ] **Step 3: 运行构建**

Run: `pnpm build`
Expected: 构建成功

- [ ] **Step 4: 验证所有工具协同工作**

Run: `pnpm run format && pnpm run lint:oxlint && pnpm run typecheck && pnpm test`
Expected: 所有命令成功执行

- [ ] **Step 5: 提交最终验证**

```bash
git add .
git commit -m "chore: verify oxfmt and oxlint integration with existing tools"
```

### Task 9: 更新文档

**Covers:** [S8]

**Files:**
- Modify: `README.MD`（可选）

- [ ] **Step 1: 检查是否需要更新 README**

Run: `cat README.MD`
Expected: 查看当前 README 内容

- [ ] **Step 2: 如果需要，添加 oxfmt 和 oxlint 使用说明**

在 README 中添加以下内容（如果适用）：
```markdown
## 代码质量工具

### 格式化
- 运行 `pnpm format` 格式化代码
- 运行 `pnpm format:check` 检查格式化

### Lint
- 运行 `pnpm run lint:oxlint` 检查代码质量
- 运行 `pnpm run lint:fix` 自动修复 lint 问题

### 类型检查
- 运行 `pnpm run typecheck` 检查 TypeScript 类型
```

- [ ] **Step 3: 提交文档更新**

```bash
git add README.MD
git commit -m "docs: add oxfmt and oxlint usage instructions"
```