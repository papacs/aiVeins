---
title: Prompt Engineering
slug: prompt-engineering
aliases: [提示工程]
category: 应用架构
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 设计和迭代模型指令、示例与输出要求，让模型在指定任务上更稳定地产生所需结果。
analogy: 像把任务说明写清楚：目标、边界、示例和验收标准越明确，返工越少。
solves: [澄清任务与输出要求, 用少量示例引导行为, 快速迭代模型表现]
boundaries: [提示无法补回缺失事实或工具, 再长的提示也不能替代评测和系统设计]
use_when: [任务能通过说明和示例改善, 需要低成本快速迭代]
avoid_when: [问题来自检索数据或权限, 逻辑应由确定性代码保证]
pitfalls: [堆砌万能咒语, 只用顺利样例调试, 系统提示无限膨胀]
related: [context-engineering, llm, evaluation, fine-tuning]
prerequisites: [llm]
sources:
  - name: OpenAI · Prompt engineering
    url: https://platform.openai.com/docs/guides/prompt-engineering
---

## 提示只是上下文的一部分

生产系统还需要选择资料、工具、历史、记忆和输出约束。Prompt Engineering 聚焦“怎么表达任务”，Context Engineering 关注“模型此刻看到的整套信息”。
