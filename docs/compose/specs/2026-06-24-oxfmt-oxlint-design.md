# oxfmt 和 oxlint 集成设计文档

## [S1] 问题

当前项目缺少代码格式化和 lint 工具，导致：
- 代码风格不一致
- 缺少静态代码分析
- 没有自动化的代码质量检查
- 依赖手动的代码审查来保证质量

## [S2] 解决方案概述

添加 oxfmt（代码格式化）和 oxlint（代码 lint）到项目中，提供：
- 自动化的代码格式化
- 静态代码分析
- 与现有 TypeScript 类型检查和测试的集成
- 可配置的规则以适应加密库的特殊需求

## [S3] 架构设计

### 包管理
- 在根目录 `package.json` 中添加 `oxfmt` 和 `oxlint` 作为 devDependencies
- 使用 pnpm workspace 确保依赖在所有包中可用

### 配置文件位置
- 根目录：`.oxfmtrc.json`（全局格式化配置）
- 根目录：`.oxlintrc.json`（全局 lint 配置）
- 可以在 `packages/espresso/` 中添加覆盖配置（如果需要）

### 脚本集成
- 根目录 `package.json` 添加脚本：`format`, `lint`, `lint:fix`
- `packages/espresso/package.json` 添加相应脚本
- 保留现有的 `tsc --noEmit` 作为类型检查

### CI/CD 集成（可选）
- 在 CI 流程中添加 oxfmt 和 oxlint 检查
- 确保代码在合并前通过格式化和 lint 检查

## [S4] 组件设计

### 新文件
1. `.oxfmtrc.json` - oxfmt 格式化配置
   - 包含缩进、引号、分号等格式化规则
   - 针对 TypeScript 项目优化

2. `.oxlintrc.json` - oxlint lint 配置
   - 包含 TypeScript 相关规则
   - 包含安全相关的 lint 规则（针对加密库）
   - 包含代码质量规则

### 修改的文件
3. 根目录 `package.json`
   - 添加 `oxfmt` 和 `oxlint` 依赖
   - 添加 `format`, `lint`, `lint:fix` 脚本

4. `packages/espresso/package.json`
   - 添加 `format`, `lint`, `lint:fix` 脚本

5. `.gitignore`（可选）
   - 添加 oxfmt/oxlint 生成的文件（如果有的话）

### 配置细节

`.oxfmtrc.json` 配置：
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

`.oxlintrc.json` 配置：
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

## [S5] 数据流设计

### 开发流程
1. **代码编写**：开发者编写 TypeScript 代码
2. **格式化**：运行 `pnpm format` 自动格式化代码
3. **Lint 检查**：运行 `pnpm lint` 检查代码质量
4. **类型检查**：运行 `tsc --noEmit` 检查类型（现有）
5. **测试**：运行 `pnpm test` 执行测试（现有）

### CI/CD 流程
1. **代码推送**：开发者推送代码到仓库
2. **CI 检查**：
   - 运行 `pnpm format --check` 检查格式化
   - 运行 `pnpm lint` 检查 lint 规则
   - 运行 `tsc --noEmit` 检查类型
   - 运行 `pnpm test` 执行测试
3. **合并**：所有检查通过后允许合并

### 工具交互
- oxfmt：读取源代码文件，应用格式化规则，输出格式化后的代码
- oxlint：读取源代码文件，应用 lint 规则，输出错误/警告信息
- tsc：读取 TypeScript 代码，进行类型检查，输出类型错误
- rstest：运行测试用例，输出测试结果

### 依赖关系
- oxfmt 和 oxlint 是独立的工具，可以并行运行
- tsc 和 rstest 依赖于代码的正确性，应在格式化和 lint 之后运行

## [S6] 错误处理设计

### 格式化错误（oxfmt）
1. **语法错误**：如果源代码有语法错误，oxfmt 可能无法格式化
   - 处理：跳过格式化，输出警告信息
   - 开发者需要先修复语法错误

2. **配置错误**：如果 oxfmt.json 配置无效
   - 处理：使用默认配置，输出配置错误信息
   - 开发者需要修正配置文件

### Lint 错误（oxlint）
1. **错误级别**：
   - `error`：必须修复，否则 lint 失败
   - `warn`：建议修复，但不阻止构建
   - `off`：禁用规则

2. **错误输出**：
   - 格式：`文件路径:行号:列号: 规则名称: 错误描述`
   - 示例：`src/aes.ts:15:5: @typescript-eslint/no-unused-vars: 'key' is defined but never used`

3. **退出码**：
   - 0：没有错误
   - 1：有错误（阻止 CI/CD）
   - 2：有警告（不阻止 CI/CD）

### 类型检查错误（tsc）
- 保持现有行为：类型错误阻止构建

### 测试错误（rstest）
- 保持现有行为：测试失败阻止构建

### 错误恢复策略
1. **开发环境**：
   - 运行 `pnpm lint:fix` 尝试自动修复
   - 手动修复剩余错误

2. **CI/CD 环境**：
   - 检查失败时阻止合并
   - 提供详细的错误信息供开发者修复

### 日志和报告
- 所有工具的输出都显示在控制台
- 可以添加 `--format json` 选项生成机器可读的报告（可选）

## [S7] 测试设计

### 验证步骤
1. 安装依赖：`pnpm install`
2. 运行格式化：`pnpm format`
3. 运行 lint：`pnpm lint`
4. 运行类型检查：`tsc --noEmit`
5. 运行测试：`pnpm test`
6. 检查所有命令是否成功执行

### 预期结果
- 所有命令正常执行，无意外错误
- 代码格式符合 oxfmt 规则
- 代码质量符合 oxlint 规则
- 类型检查通过
- 测试通过

### 边界情况测试
- 测试空文件的处理
- 测试大型文件的处理
- 测试包含特殊字符的文件

### CI/CD 模拟
- 模拟 CI 环境运行所有检查
- 确认退出码正确
- 确认错误输出格式正确

## [S8] 实施计划

### 阶段 1：基础设置
1. 安装 oxfmt 和 oxlint 依赖
2. 创建基本配置文件
3. 添加 npm 脚本

### 阶段 2：配置优化
1. 根据项目需求优化 oxfmt 配置
2. 根据项目需求优化 oxlint 配置
3. 测试配置效果

### 阶段 3：集成验证
1. 在现有代码上运行所有工具
2. 验证与现有工作流的兼容性
3. 修复发现的问题

### 阶段 4：文档和培训
1. 更新项目文档
2. 提供使用指南
3. 团队培训（如果需要）

## [S9] 风险和缓解措施

### 风险 1：配置冲突
- **风险**：oxlint 规则与现有 TypeScript 配置冲突
- **缓解**：仔细测试配置，逐步引入规则

### 风险 2：性能影响
- **风险**：添加额外的检查步骤可能影响开发体验
- **缓解**：优化配置，只启用必要的规则

### 风险 3：学习曲线
- **风险**：团队需要学习新的工具和配置
- **缓解**：提供详细的文档和示例

### 风险 4：迁移成本
- **风险**：现有代码可能需要大量修改以符合新规则
- **缓解**：渐进式迁移，先修复 error 级别的问题