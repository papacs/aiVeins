---
title: RAG
slug: rag
aliases: [检索增强生成, Retrieval-Augmented Generation]
category: 检索
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 回答前先从外部资料中检索相关片段，再把它们作为上下文交给模型生成答案的方法。
analogy: 像开卷考试：模型不用凭记忆硬答，而是先翻到可能相关的页，再根据找到的材料作答。
solves: [让回答基于私有或最新资料, 为答案提供可追溯来源, 减少对训练记忆的依赖]
boundaries: [RAG 不保证资料正确, 检索到材料也不保证模型正确引用, 它不是训练模型]
use_when: [知识频繁更新, 内容来自企业或个人资料库, 需要引用来源]
avoid_when:
  [资料很少且可直接放进上下文, 任务主要改变输出风格或行为, 问题不依赖外部知识]
pitfalls: [只优化向量库忽略数据清洗, 切块破坏语义, 没有分别评测检索和生成]
related: [embedding, vector-search, long-context, fine-tuning, knowledge-base]
prerequisites: [llm]
sources:
  - name: Google · Machine Learning Glossary — RAG
    url: https://developers.google.com/machine-learning/glossary#retrieval-augmented-generation
  - name: Lewis et al. · Retrieval-Augmented Generation
    url: https://arxiv.org/abs/2005.11401
---

## 基本流程

系统把问题转换成检索请求，从知识库召回候选片段，必要时重排，然后将精选上下文与问题一起交给模型。

## 先判断瓶颈

回答错误时先检查“正确资料有没有被检索到”。如果没有，是检索问题；如果有但答错，才主要是生成和提示问题。
