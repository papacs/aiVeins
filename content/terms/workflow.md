---
title: Workflow
slug: workflow
aliases: [工作流, Agentic Workflow]
category: 应用架构
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 由代码预先规定步骤、分支与顺序，让模型和工具沿确定路径协作完成任务的系统。
analogy: 像餐厅的标准操作手册：每一步由流程规定，厨师可以在某一步发挥，但不能任意改变整条流水线。
solves: [重复任务的一致执行, 将复杂任务拆成可检查的小步骤]
boundaries: [Workflow 可以包含模型但不把流程控制权交给模型, 它不是低级版 Agent]
use_when: [步骤已知且稳定, 需要可预测成本和结果, 中间结果需要规则校验]
avoid_when: [路径无法事先枚举, 环境变化要求持续重新规划]
pitfalls:
  [
    把所有步骤都做成模型调用,
    分支爆炸后仍坚持硬编码,
    没有保存中间结果导致难以恢复,
  ]
related: [agent, evaluation, tool-calling]
prerequisites: [llm]
sources:
  - name: Anthropic · Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
---

## 常见模式

Prompt chaining、路由、并行执行、生成后校验，都是工作流。它们的共同点是控制流主要写在代码里。

## 为什么常常更可靠

固定路径更容易测试、观察和回放。对发票提取、内容审核、报告生成等结构相对稳定的任务，Workflow 往往比 Agent 更便宜也更可控。
