---
title: MCP
slug: mcp
aliases: [Model Context Protocol, 模型上下文协议]
category: Agent 工程
level: 入门
status: verified
trend: 快速演变
last_verified: '2026-09-04'
summary: 一套让 AI 应用以统一方式连接外部工具、资源和提示的开放协议，规定主机、客户端与服务器如何通信。
analogy: 像 AI 应用的通用接口规范：接入方不必为每个工具重新发明连接方式，但具体能力仍由服务器提供。
solves: [降低 AI 应用与外部系统的重复集成成本, 让能力可以被多个兼容客户端复用]
boundaries:
  [MCP 本身不是 Agent, 协议不会自动保证工具安全可靠, 它不等同于一次函数调用]
use_when: [能力需要被多个 AI 客户端复用, 需要标准化能力发现和会话通信]
avoid_when: [只有一个简单且封闭的内部调用, 协议成本高于复用价值]
pitfalls: [把服务器声明的内容当作可信, 权限范围过宽, 忽略协议版本与能力协商]
related: [tool-calling, agent, guardrail]
prerequisites: [llm]
sources:
  - name: MCP · Architecture
    url: https://modelcontextprotocol.io/specification/2025-06-18/architecture
  - name: MCP · Server features
    url: https://modelcontextprotocol.io/specification/2025-06-18/server/index
---

## 三个角色

Host 是承载 AI 的应用；每个 Client 维护到特定 Server 的连接；Server 暴露资源、提示和工具。安全边界与用户授权主要由 Host 负责。

## 变化很快

MCP 规范持续演进，接入时应固定并记录协议版本。本文把“稳定理解”和“具体版本能力”分开，避免把某次实现当成永久定义。
