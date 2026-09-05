---
title: Workflow
slug: workflow
aliases: [工作流, Agentic Workflow]
category: 应用架构
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-05'
summary: 由代码预先规定主要步骤和允许的分支，让模型与工具按可检查的流程协作；实际走哪条分支仍可能取决于输入与模型结果。
analogy: 像餐厅的标准操作手册：每一步由流程规定，厨师可以在某一步发挥，但不能任意改变整条流水线。
solves: [重复任务的一致执行, 将复杂任务拆成可检查的小步骤]
boundaries:
  [
    预定义流程不保证模型输出确定,
    可以用模型路由但允许的分支由程序限定,
    它不是低级版 Agent,
  ]
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
learning_objectives:
  - 把一个模型功能拆成可检查和可恢复的步骤
  - 区分固定控制流、模型输出的不确定性与重试风险
exercise:
  question: 工作流在“创建工单”时超时了，但不确定后台是否已经创建成功。直接从头再跑一遍为什么可能有问题？
  answer: 超时不等于操作没有执行，从头重跑可能重复创建工单。应保存请求标识和步骤状态，先核查结果；有副作用的接口需要约定幂等或去重行为。生成文本可以重试，不代表创建业务记录也能无条件重试。
sources:
  - id: workflow-patterns
    name: Building effective agents — Workflows
    url: https://www.anthropic.com/engineering/building-effective-agents
    publisher: Anthropic
    kind: 一手工程实践
    accessed: '2026-09-05'
    supports: 介绍提示串联、路由、并行及生成后评估等组合模式，并区分预定义流程与模型自主控制。
    limitation: 模式是工程参考，文章不能证明某个工作流在所有业务上必然更便宜或更可靠。
  - id: idempotency
    name: Making retries safe with idempotent APIs
    url: https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/
    publisher: AWS Builders’ Library
    kind: 一手工程实践
    accessed: '2026-09-05'
    supports: 解释重试可能造成重复副作用，以及通过请求标识和幂等接口降低风险的设计思路。
    limitation: 这是分布式系统设计经验，不是所有接口天然支持幂等，也不是某个 LLM 框架的功能承诺。
---

## 固定的是允许的流程

Workflow 可以有分支、并行和模型判断，并不意味着每次都走相同路线。关键是程序预先定义了可走的步骤与衔接方式。模型可以决定“物流还是退款”，但不能因此任意添加一个未经设计的支付步骤。[1](#source-workflow-patterns)

## 拆解一个工单流程

**本站教学示例：** 把客服留言变成待处理工单。

1. **输入检查：** 空消息直接返回提示，不调用模型。
2. **信息提取：** 模型提取分类、订单号和原文依据。
3. **结构与业务校验：** 检查字段、订单归属和必要信息。
4. **分支处理：** 信息不足则询问；可处理则创建草稿；特殊情况转人工。
5. **记录结果：** 保存工单标识与失败状态，便于恢复。

其中输入检查和订单归属适合普通代码；信息提取才是需要语言理解的部分。不必把每个步骤都包装成模型调用。

## 给每一步约定失败出口

```text
提取失败 → 限次重试或转人工
编号缺失 → 请求补充，不猜编号
权限不足 → 拒绝处理，不暴露订单内容
创建超时 → 先查请求状态，再决定是否重试
```

这份列表可以直接变成测试场景。还要区分“生成结果不合格”和“网络暂时失败”，避免对不同原因使用同一种重试。

## 重试不是从头再来

如果创建工单已经成功，只是响应丢失，再执行一次可能产生重复记录。AWS 的一手工程资料讨论了利用幂等请求设计控制这类重复副作用。[2](#source-idempotency)

实践中要约定：哪个请求标识表示同一次业务意图、重复请求如何返回结果、保留多久、参数变化如何处理。本文只给出检查方向，不能代替具体业务接口的契约。

## 怎样证明流程改善了

本站建议比较两版流程时，至少记录每个步骤的失败率、端到端完成率、人工介入次数和耗时。固定流程更便于定位错误，但仍可能包含不稳定的模型步骤；不能从流程图整齐就推断系统可靠。

如果分支开始难以维护，先检查任务是否划分过粗，再考虑让某个局部步骤具有自主决策能力。Workflow 与 [Agent](/glossary/agent) 可以组合，不需要一次把全部控制权交给模型。
