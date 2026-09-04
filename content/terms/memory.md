---
title: Memory
slug: memory
aliases: [Agent Memory, 智能体记忆]
category: Agent 工程
level: 进阶
status: researching
trend: 存在争议
last_verified: '2026-09-04'
summary: AI 系统跨步骤或跨会话保存并重新使用用户偏好、经历、状态或总结的一组机制。
analogy: 像工作日志与便签：记录对以后有用的经历，不等于把整个资料库背在脑子里。
solves: [跨会话个性化, 长任务中保留进展与经验]
boundaries: [Memory 没有统一工程定义, 它和知识库、聊天历史、模型参数都不同]
use_when: [后续任务确实依赖过去经历, 用户可以查看纠正或删除记录]
avoid_when: [信息只是本轮临时状态, 无法说明保存目的和期限, 隐私风险高]
pitfalls: [什么都记导致噪声和隐私风险, 错误总结长期传播, 召回内容没有来源和时间]
related: [knowledge-base, context-engineering, agent]
prerequisites: [llm]
sources:
  - name: Anthropic · Building effective agents
    url: https://www.anthropic.com/engineering/building-effective-agents
---

## 先定义你说的记忆

团队讨论 Memory 时，应明确是短期工作状态、长期用户偏好、历史摘要，还是可检索经验。不同类型的生命周期、权限和评测方法完全不同。
