---
title: Evaluation
slug: evaluation
aliases: [Eval, 评测]
category: 评测与安全
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 用代表性样本、明确标准和可重复流程，判断 AI 系统在目标任务上是否足够好以及改动是否真的有帮助。
analogy: 像驾照考试：不是问车看起来多先进，而是在规定场景和标准下检查它是否能安全完成任务。
solves:
  [把主观感觉变成可比较证据, 防止优化一处却破坏另一处, 监控上线后的质量变化]
boundaries: [单一公开榜单不能替代业务评测, LLM 评分也需要校准和抽查]
use_when: [任何准备上线或迭代的 AI 功能, 需要比较模型、提示、检索或架构]
avoid_when: [没有明确任务与成功标准时不应伪造一个总分]
pitfalls: [测试集与真实流量不一致, 指标与用户价值脱节, 反复调参污染测试集]
related: [llm, agent, guardrail, fine-tuning]
prerequisites: [llm]
sources:
  - name: OpenAI · Evaluation best practices
    url: https://platform.openai.com/docs/guides/evaluation-best-practices
---

## 从错误分类开始

先收集真实案例并给失败分类，再决定自动指标、人工评审和模型评审如何组合。一个平均分很难告诉你该修检索、提示、工具还是产品流程。
