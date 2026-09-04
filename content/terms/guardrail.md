---
title: Guardrail
slug: guardrail
aliases: [护栏, 安全护栏]
category: 评测与安全
level: 进阶
status: verified
trend: 当前热门
last_verified: '2026-09-04'
summary: 在 AI 系统输入、推理过程或输出周围设置的规则、检测和控制，用来降低不允许行为与错误操作的风险。
analogy: 像山路护栏：它能降低冲出边界的概率，但不能让驾驶员永远不犯错，也不能替代刹车和道路设计。
solves: [拦截明显违规输入输出, 限制高风险操作, 为异常提供升级或人工审核路径]
boundaries: [Guardrail 不是绝对安全保证, 文本检测不能替代真正的系统权限隔离]
use_when: [系统会处理敏感内容或执行动作, 需要把政策落实为可检查控制]
avoid_when: [用自然语言规则替代操作系统或数据库权限]
pitfalls: [只在输出末端检测, 误报导致产品不可用, 没有针对绕过方式持续测试]
related: [agent, tool-calling, evaluation]
prerequisites: [llm, evaluation]
sources:
  - name: Anthropic · Trustworthy agents in practice
    url: https://www.anthropic.com/research/trustworthy-agents
  - name: MCP · Architecture security boundaries
    url: https://modelcontextprotocol.io/specification/2025-06-18/architecture
---

## 分层控制

可靠系统通常同时使用输入检查、工具白名单、最小权限、参数验证、人工确认、沙箱、输出审查和审计日志。任何单层都可能被绕过或误判。
