---
title: Context Engineering
slug: context-engineering
aliases: [上下文工程]
category: 应用架构
level: 进阶
status: verified
trend: 当前热门
last_verified: '2026-09-04'
summary: 设计模型每次推理时实际看到的信息组合，包括指令、资料、工具、历史、记忆和中间状态。
analogy: 像为同事准备一张干净的工作台：不是把所有东西都堆上去，而是在正确时刻放上完成当前步骤所需的材料。
solves: [有限上下文里的信息取舍, 多轮与 Agent 任务中的状态组织]
boundaries: [它不只是把 Prompt 写长, 更多上下文不必然带来更好结果]
use_when: [系统有多类动态信息, Agent 运行多步并需要保持关键状态]
avoid_when: [单次简单任务已能用短提示稳定完成]
pitfalls: [上下文无限增长, 不区分可信指令与外部内容, 把无关历史反复带入]
related: [prompt-engineering, rag, long-context, agent, memory]
prerequisites: [llm]
sources:
  - name: Anthropic · Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
---

## 设计目标

好的上下文不是最多，而是对当前决策足够、相关、可信并且可追踪。常用手段包括检索、压缩、摘要、分层记忆和按需加载工具说明。
