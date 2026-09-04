---
title: Fine-tuning
slug: fine-tuning
aliases: [微调, Fine-tune]
category: 基础模型
level: 进阶
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 用特定任务或领域的数据继续训练已有模型，使其更稳定地表现出目标行为、格式或能力。
analogy: 像给已有广泛基础的员工做专项训练：改变的是做事习惯与能力，不是每天塞给他一摞最新资料。
solves: [稳定特定输出风格或格式, 提升重复任务表现, 压缩复杂提示中的行为示例]
boundaries: [微调不适合注入频繁变化的事实, 它不自动消除幻觉]
use_when: [已有明确评测和高质量示例, 提示方法已到瓶颈, 任务模式稳定且量足够]
avoid_when: [目标只是接入最新资料, 需求仍在快速变化, 没有基准集判断是否变好]
pitfalls: [训练数据代表性差, 只看训练指标不看真实任务, 忘记评估基础能力退化]
related: [rag, llm, evaluation, prompt-engineering]
prerequisites: [llm, evaluation]
sources:
  - name: OpenAI · Model optimization
    url: https://platform.openai.com/docs/guides/model-optimization
---

## 先从评测开始

没有评测集，就无法知道微调是在提升真实能力，还是只记住样例。通常先做提示、检索和结构化输出，确认瓶颈后再微调。
