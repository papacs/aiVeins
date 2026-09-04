---
title: Long Context
slug: long-context
aliases: [长上下文, 长上下文窗口]
category: 基础模型
level: 入门
status: verified
trend: 当前热门
last_verified: '2026-09-04'
summary: 模型在一次请求里能接收和处理较大量 token 的能力，用来同时阅读长文档、代码库或长对话。
analogy: 像把更多资料一次摊在更大的桌面上；桌面变大不代表每一页都能被同样认真地看见。
solves: [减少长材料的预切分, 保留跨段落或跨文件关系]
boundaries:
  [标称窗口大小不等于所有位置的信息都能稳定召回, 更长输入会增加成本与延迟]
use_when: [资料规模可控并且整体关系重要, 需要快速原型或处理单个长文档]
avoid_when: [语料库持续增长, 只需要少量局部事实, 每次重复发送大量相同内容]
pitfalls: [把能放进去误当能准确用到, 缺少长上下文专用评测, 忽略输入成本]
related: [rag, context-engineering, llm]
prerequisites: [llm]
sources:
  - name: Google · Machine Learning Glossary
    url: https://developers.google.com/machine-learning/glossary
---

## 和 RAG 的关系

两者不是非此即彼。常见系统先检索出一组较长材料，再利用长上下文综合它们；选择取决于数据规模、更新频率、成本和可追溯要求。
