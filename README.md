# AI 脉络（aiVeins）

[![CI](https://github.com/papacs/aiVeins/actions/workflows/ci.yml/badge.svg)](https://github.com/papacs/aiVeins/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-2563eb.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%E2%89%A522.13-16a34a.svg)](package.json)

给中文 AI 学习者和应用开发者的工程决策与反黑话手册。

AI 脉络不只解释“RAG 是什么”，还会回答：它解决什么、不解决什么、什么时候值得用、什么时候应该先别用，以及它最容易和哪些概念混淆。内容通过结构化 Markdown 管理，同时服务网页阅读、搜索、对比和机器读取。

- **在线站点：** [ai-veins-cn.kakaluya.chatgpt.site](https://ai-veins-cn.kakaluya.chatgpt.site)
- **源码仓库：** [github.com/papacs/aiVeins](https://github.com/papacs/aiVeins)

> 当前版本：`0.1.0`。项目处于早期可用阶段，内容结构与核心浏览体验已经稳定，词条仍在持续扩充。

## 为什么需要它

AI 术语更新快、定义边界模糊，同一个词经常同时出现在论文、产品文档和营销表达里。只记住一句定义，通常不足以支撑真实的技术选择。

AI 脉络坚持四条内容原则：

- **先讲人话：** 从实际问题出发，再解释机制和术语。
- **写清边界：** 同时说明适用条件、不适用场景和常见失败方式。
- **保持可核验：** 正式词条包含可信来源与最后核验日期。
- **强调关联：** 通过对比、前置概念和学习路径，建立知识脉络而不是孤立词典。

## 主要能力

- 可搜索、可按分类筛选的中文 AI 术语库
- 分层词条页：30 秒解释、类比、机制、适用/不适用场景、失败方式和延伸阅读
- Agent vs Workflow、RAG vs Fine-tuning 等高混淆概念对比
- 面向零基础、知识库实践者和应用开发者的学习路径
- 聚焦长期变化而非每日新闻的 AI 雷达
- `/glossary.json` 与 `/llms.txt` 机器可读出口
- 浏览器支持时自动注册的 WebMCP 术语搜索工具
- 基于 Schema 的内容、关联引用和来源校验
- CI、Issue/PR 模板、行为准则、安全政策与自动依赖更新

## 快速开始

### 环境要求

- Node.js `22.13.0` 或更高版本
- npm

### 本地运行

```bash
git clone https://github.com/papacs/aiVeins.git
cd aiVeins
npm install
npm run dev
```

打开终端显示的本地地址即可浏览。提交变更前运行完整检查：

```bash
npm run check
```

### 常用命令

| 命令                       | 用途                               |
| -------------------------- | ---------------------------------- |
| `npm run dev`              | 启动本地开发服务器                 |
| `npm run content:validate` | 校验词条字段、关系和来源           |
| `npm run test`             | 运行内容契约测试                   |
| `npm run lint`             | 检查应用与脚本代码                 |
| `npm run format:check`     | 检查格式但不改写文件               |
| `npm run build`            | 校验内容并生成生产构建             |
| `npm run check`            | 依次运行内容校验、Lint、测试和构建 |

## 信息架构

```text
content/terms/*.md
        │
        ▼
lib/content.ts ── Schema 校验、关系解析、排序与导出
        │
        ├── app/                 网页、SEO、sitemap、robots
        ├── /glossary.json       结构化术语数据
        └── /llms.txt            面向模型的文本索引
```

关键目录：

| 路径                    | 说明                                  |
| ----------------------- | ------------------------------------- |
| `content/terms/`        | 词条唯一内容源，每个概念一份 Markdown |
| `app/`                  | Vinext 页面、路由与数据出口           |
| `components/`           | 可复用界面与交互组件                  |
| `lib/content.ts`        | 内容 Schema、读取与派生逻辑           |
| `scripts/`              | 可在 CI 独立运行的内容校验脚本        |
| `tests/`                | 内容契约和关键行为测试                |
| `docs/TERM_TEMPLATE.md` | 新词条模板与字段示例                  |

## 内容模型

每个词条由 YAML Frontmatter 和 Markdown 正文组成。Frontmatter 保存可校验的数据，正文负责进一步解释；页面和机器可读出口都从同一份内容生成。

```yaml
title: RAG
slug: rag
aliases: [检索增强生成, Retrieval-Augmented Generation]
status: verified
category: 检索
last_verified: '2026-09-04'
use_when:
  - 回答需要引用外部或私有知识
avoid_when:
  - 问题主要来自模型缺乏特定行为模式
related:
  - embedding
  - vector-search
```

内容状态不是完成度装饰，而是读者能否放心引用的信号：

| 状态          | 含义                                             |
| ------------- | ------------------------------------------------ |
| `researching` | 仍在收集资料或定义存在争议，不应作为确定结论引用 |
| `verified`    | 结构完整，关键事实、来源与边界已核验             |
| `outdated`    | 已确认内容过期，等待修订                         |

趋势标签（基础概念、当前热门、快速演变、存在争议）描述内容稳定性和学习优先级，不代表技术排名。

## 参与贡献

欢迎补充高价值词条、修正边界、更新过期来源、改善可访问性或完善测试。

1. 阅读 [贡献指南](CONTRIBUTING.md) 和 [协作约定](AGENTS.md)。
2. 新词条从 [词条模板](docs/TERM_TEMPLATE.md) 开始，文件名与 `slug` 保持一致。
3. 优先引用官方文档、标准、原始论文或一手技术资料。
4. 运行 `npm run check`，确认内容、测试和生产构建全部通过。
5. 提交 PR，并说明动机、核心变化和验证结果。

如果不确定概念是否值得新增，可以先使用仓库的 Concept proposal Issue 模板讨论。行为规范见 [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)，安全问题请按 [SECURITY.md](SECURITY.md) 私下报告。

## 路线图

- [x] 首批核心概念与决策页
- [x] 搜索、概念对比、学习路径、AI 雷达与机器可读导出
- [x] 内容 Schema、校验测试和开源协作基线
- [ ] 扩展到 40 个高价值 AI 应用工程词条
- [ ] 增加可复现的最小代码示例
- [ ] 自动检查外部来源可访问性与核验日期
- [ ] 基于同一内容源提供独立 MCP Server

版本变化记录在 [CHANGELOG.md](CHANGELOG.md)。路线图会根据真实使用反馈调整，不承诺固定发布日期。

## 技术栈

- Vinext、React 19、TypeScript
- Tailwind CSS、shadcn/ui
- Zod、YAML、React Markdown
- Node.js Test Runner、Oxlint、Oxfmt
- Cloudflare Workers 构建目标

## 许可证

代码与原创内容以 [MIT License](LICENSE) 发布。引用和链接到的第三方资料仍归各自权利方所有。

---

如果这个项目帮你少踩了一个概念坑，欢迎 Star、提交勘误，或分享一个你希望我们拆清楚的 AI 术语。
