---
title: Embedding
slug: embedding
aliases: [嵌入, 向量表示]
category: 检索
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 把文本、图像等内容转换成一串数字，使语义相近的内容在向量空间中更接近的表示方法。
analogy: 像给每段内容一个“含义坐标”：谈论相近事情的文本会落在地图上相近的位置。
solves: [按语义而非字面匹配内容, 为聚类、推荐和向量检索提供数值表示]
boundaries: [Embedding 会压缩并丢失信息, 距离近不保证事实相关或答案正确]
use_when: [用户与文档用词不完全相同, 需要从大量非结构化内容召回候选]
avoid_when: [必须精确匹配编号姓名或符号, 关系可用结构化查询清楚表达]
pitfalls: [混用不同模型生成的向量, 不更新已修改文档, 只看相似度不评测召回]
related: [vector-search, rag]
prerequisites: []
sources:
  - name: Google · Machine Learning Glossary — Embeddings
    url: https://developers.google.com/machine-learning/glossary#embeddings
---

## 不是知识本身

向量是为相似度计算服务的压缩表示。它适合帮助系统“先找到可能相关的内容”，不适合作为可直接解释或精确还原的事实存储。
