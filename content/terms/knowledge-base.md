---
title: Knowledge Base
slug: knowledge-base
aliases: [知识库]
category: 检索
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-04'
summary: 被组织、维护并可检索的外部事实与资料集合，常作为 RAG 的内容来源。
analogy: 像图书馆：它保存和编目资料，但不会自动理解你的问题，也不会替你完成回答。
solves: [集中维护组织知识, 为检索和问答提供可治理的信息源]
boundaries: [知识库不是模型记忆, 向量数据库只是可能的存储与检索组件]
use_when: [资料需要持续更新与审计, 多个应用共享同一事实来源]
avoid_when: [信息极少且稳定, 没有维护责任人]
pitfalls: [垃圾资料入库后期待模型纠正, 缺少权限过滤, 不记录版本和来源]
related: [rag, vector-search, memory]
prerequisites: []
sources:
  - name: Google · Machine Learning Glossary
    url: https://developers.google.com/machine-learning/glossary
---

## 质量比规模重要

有效知识库需要来源、更新时间、访问控制、去重和失效策略。检索系统只能在现有资料上工作，不能把过期或矛盾内容自动变成真相。
