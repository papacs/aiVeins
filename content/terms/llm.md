---
title: LLM
slug: llm
aliases: [大语言模型, Large Language Model]
category: 基础模型
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 在大量文本与代码上训练、根据已有上下文预测后续 token，并由此生成或理解语言的模型。
analogy: 像读过大量材料的续写引擎：它非常擅长延续合理模式，但“听起来合理”不自动等于事实正确。
solves: [自然语言理解与生成, 从示例和指令中完成多种文本任务]
boundaries: [LLM 不是数据库或搜索引擎, 生成概率高的文本不代表在检索事实]
use_when: [输入输出难以用固定规则穷举, 任务可通过语言描述并允许概率性结果]
avoid_when: [必须精确计算, 规则简单确定, 结果无法校验且错误代价极高]
pitfalls: [把流畅当准确, 忽略上下文窗口和成本, 没有针对真实输入做评测]
related: [prompt-engineering, context-engineering, rag, evaluation]
prerequisites: []
sources:
  - name: Google · Machine Learning Glossary
    url: https://developers.google.com/machine-learning/glossary
---

## 关键直觉

LLM 的基础任务是预测下一个 token。聊天、摘要、代码生成等能力都建立在这个训练目标和后续对齐之上。

## 工程上的含义

相同输入可能产生不同结果。上线前需要定义质量标准、收集真实样本并持续评测，而不是只挑几个顺利案例。
