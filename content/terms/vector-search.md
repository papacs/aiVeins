---
title: Vector Search
slug: vector-search
aliases: [向量检索, 语义检索]
category: 检索
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 将查询转换为向量，并按距离从已有向量中找出语义最相近内容的检索方法。
analogy: 像在“含义地图”上寻找最近的邻居，而不是只找出现了完全相同关键词的页面。
solves: [跨措辞召回语义相关内容, 在非结构化资料中快速筛选候选]
boundaries: [它不是 RAG 的全部, 不擅长所有精确匹配和复杂过滤]
use_when: [自然语言表达多样, 文档量较大且需要语义召回]
avoid_when: [ID、日期和专有名词必须精确命中, 传统过滤或全文搜索已足够]
pitfalls: [忽略关键词检索优势, 距离阈值凭感觉设置, 没有结合元数据权限过滤]
related: [embedding, rag, knowledge-base]
prerequisites: [embedding]
sources:
  - name: Google · Machine Learning Glossary
    url: https://developers.google.com/machine-learning/glossary
---

## 常见组合

生产检索常把关键词检索与向量检索合并，再用 reranker 重排候选。混合检索并非总是更好，仍要用真实问题测试召回率和最终回答质量。
