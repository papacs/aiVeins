---
title: Tool Calling
slug: tool-calling
aliases: [工具调用, Function Calling]
category: Agent 工程
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 模型根据工具描述生成结构化调用请求，再由应用执行真实函数并把结果返回给模型的机制。
analogy: 像模型填写一张操作申请单：它负责选择工具和参数，真正执行的人仍是你的应用代码。
solves: [让模型安全地请求确定性能力, 将自然语言意图转换为结构化参数]
boundaries: [模型不会直接执行函数, 结构正确不代表参数合理或操作获授权]
use_when: [模型需要查询外部数据或执行动作, 参数能用明确 schema 表达]
avoid_when: [普通代码已知道该调用什么, 目标无法形成清晰工具契约]
pitfalls: [工具说明模糊, 未验证参数, 把高风险动作交给模型自动执行]
related: [mcp, agent, guardrail]
prerequisites: [llm]
sources:
  - name: OpenAI · Function calling
    url: https://platform.openai.com/docs/guides/function-calling
---

## 一次完整调用

应用把可用工具及参数结构发给模型；模型返回工具名与参数；应用验证权限和参数后执行；结果再回到模型，用于生成答复或继续行动。
