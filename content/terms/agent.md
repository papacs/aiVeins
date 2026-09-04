---
title: Agent
slug: agent
aliases: [智能体, AI Agent]
category: Agent 工程
level: 入门
status: verified
trend: 当前热门
last_verified: '2026-09-04'
summary: 能自己决定下一步行动、选择工具，并根据结果继续调整，直到完成目标或请求人类介入的 AI 系统。
analogy: 像一位拿到目标和工具箱的同事：你说明结果，它自己决定先查资料、再操作，还是回来问你。
solves:
  [开放式任务中无法预先写死每一步的问题, 需要根据中间结果动态调整行动的问题]
boundaries: [Agent 不是有聊天界面的模型, 能调用一次工具也不等于具备持续决策能力]
use_when: [任务路径会随环境变化, 工具返回结果决定下一步, 可以接受更高延迟与成本]
avoid_when: [流程固定且可枚举, 错误代价高又缺少审批与回滚, 普通代码可以稳定解决]
pitfalls:
  [
    给了过宽权限却没有确认点,
    没有终止条件导致循环,
    只看演示成功而没有评测长尾失败,
  ]
related: [workflow, tool-calling, context-engineering, evaluation, guardrail]
prerequisites: [llm]
sources:
  - name: Anthropic · Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
  - name: Anthropic · Trustworthy agents in practice
    url: https://www.anthropic.com/research/trustworthy-agents
---

## 工作方式

典型 Agent 运行在“观察 → 判断 → 行动 → 再观察”的循环里。模型不是只生成一次答案，而是会读取工具结果、检查进展并决定下一步。

## 最小判断

如果你能在编码前画出稳定完整的流程图，优先做 Workflow；只有关键步骤确实需要模型临场选择时，再引入 Agent。

## 失败从哪里来

Agent 会把模型的不确定性放大到真实操作中。可靠性依赖权限边界、可观测性、预算、重试、审批和回滚，不只依赖模型能力。
