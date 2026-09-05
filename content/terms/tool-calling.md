---
title: Tool Calling
slug: tool-calling
aliases: [工具调用, Function Calling]
category: Agent 工程
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-05'
summary: 模型根据工具描述生成结构化调用请求，再由应用执行真实函数并把结果返回给模型的机制。
analogy: 像模型填写一张操作申请单：它负责选择工具和参数，真正执行的人仍是你的应用代码。
solves: [让模型请求外部数据或确定性能力, 将自然语言意图转换为结构化参数]
boundaries: [模型不会直接执行函数, 结构正确不代表参数合理或操作获授权]
use_when: [模型需要查询外部数据或执行动作, 参数能用明确 schema 表达]
avoid_when: [普通代码已知道该调用什么, 目标无法形成清晰工具契约]
pitfalls: [工具说明模糊, 未验证参数, 把高风险动作交给模型自动执行]
related: [mcp, agent, guardrail, structured-output]
prerequisites: [llm]
learning_objectives:
  - 说清模型提出调用、应用验证执行和结果回传的分工
  - 为一次工具调用定义参数、权限、失败与重复执行策略
exercise:
  question: 模型生成了合法的工具参数：查询订单 ORD-204。该订单存在，但属于另一位用户。参数 Schema 校验通过后，应用可以直接返回订单信息吗？
  answer: 不可以。格式校验只说明编号的结构符合要求，不能证明当前用户拥有查询权限。应用必须使用可信的登录身份验证订单归属。用户身份不能由模型生成的参数替代，拒绝访问后也不应把订单详情作为错误信息返回。
sources:
  - id: openai-tools
    name: Function calling
    url: https://developers.openai.com/api/docs/guides/function-calling
    publisher: OpenAI
    kind: 官方文档
    accessed: '2026-09-05'
    supports: 描述工具声明、模型提出调用、应用执行代码、回传结果和继续响应的调用流程。
    limitation: 参数字段与调用方式依赖具体 API；工具描述不能替代应用的授权和业务校验。
  - id: google-tools
    name: Function calling with the Gemini API
    url: https://ai.google.dev/gemini-api/docs/function-calling
    publisher: Google
    kind: 官方文档
    accessed: '2026-09-05'
    supports: 明确函数执行由应用负责，模型负责提出函数名与参数，结果可回传给模型。
    limitation: SDK 可能包装自动执行流程，但执行责任没有因此转移给语言模型。
---

## 从查询订单理解工具调用

用户说“查一下订单到哪了”，模型本身并不拥有你的订单数据库。应用可以提供一个查询函数，模型提出调用请求，由应用执行查询。OpenAI 和 Google 的文档都明确区分了“提出调用”和“执行函数”。[1](#source-openai-tools) [2](#source-google-tools)

## 一次调用经过哪些步骤

1. 应用提供工具名称、用途和参数结构。
2. 模型提出工具名与参数，也可能不调用工具或请求补充信息。
3. 应用检查工具是否在允许列表中、参数是否合法、用户是否有权限。
4. 应用执行查询，将结果或经过处理的错误回传。
5. 模型据此回复，或提出下一次调用。[1](#source-openai-tools)

```text
教学示意，不是某个 API 的原始响应格式：
用户请求 → get_order_status({ order_id: "ORD-204" })
应用校验 → 查询数据库 → { status: "shipped" }
模型回复 → 根据查询结果说明订单已发货
```

## 工具契约要写清什么

以下是本站的实现检查清单：

- **输入：** 订单号是否必填？允许哪些格式？缺失时应询问，还是返回错误？
- **身份：** 从可信登录会话获取用户身份，而不是让模型填写 `user_id` 就算授权。
- **输出：** 区分找到结果、没有结果、拒绝访问和暂时不可用，避免所有情况都返回空字符串。
- **副作用：** 查询和修改是否分开？执行修改前需要什么确认？
- **重复：** 超时之后是没有执行，还是执行了却没收到结果？有副作用的操作要考虑幂等，即同一请求重复提交不应重复产生业务效果。

## 为什么格式正确仍会失败

模型可能选择了错误工具，也可能把“取消提醒”理解成“取消订单”。参数结构正确，只代表请求长得像一张合格表单，不能证明意图、事实和权限都正确。

一个可检查的日志应包含调用标识、工具名、参数校验结果、授权结果、执行状态和耗时。敏感参数需要按实际数据政策处理，不宜无差别写入日志。

## 工具调用和其他概念怎么分

需要模型返回一份分类结果，通常关注 [结构化输出](/glossary/structured-output)；需要应用执行动作，关注工具调用。两者都可能使用结构化参数，但职责不同。

一次工具调用不自动构成 [Agent](/glossary/agent)。只有后续步骤由模型根据结果持续选择时，才涉及更完整的自主决策循环。[MCP](/glossary/mcp) 则处理连接与能力交换，不能替代这里的执行与授权设计。
