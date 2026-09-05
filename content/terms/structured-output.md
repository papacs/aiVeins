---
title: Structured Output
slug: structured-output
aliases: [结构化输出, Structured Outputs]
category: 应用架构
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-05'
summary: 用明确的数据结构约束模型返回的字段和类型，让程序更容易解析结果；它约束格式，但不保证字段内容真实正确。
analogy: 像给模型一张带固定栏目的表格：表格填写完整，不代表里面的订单号确实来自原始材料。
solves: [减少字段缺失或类型漂移, 让模型结果能进入后续程序处理]
boundaries:
  [结构符合要求不等于事实正确, 不同供应商支持的 Schema 能力并不完全相同]
use_when: [程序要消费固定字段, 需要分类或信息提取结果, 能明确约定缺失和异常状态]
avoid_when:
  [只需面向人的自由文本, 字段含义尚未确定, 试图用格式约束代替权限和业务规则]
pitfalls: [把合法 JSON 当作业务正确, 未处理拒绝或截断, 强制填满缺失信息导致编造]
related: [prompt-engineering, tool-calling, evaluation, workflow]
prerequisites: [llm]
learning_objectives:
  - 区分合法 JSON、符合 Schema 和业务正确三个层次
  - 设计缺失字段策略并运行一个本地校验例子
exercise:
  question: 原消息是“我的包裹还没到”，输出却是 {"category":"物流","order_id":"ORD-204"}。输出通过了字段类型校验，能直接拿去查订单吗？
  answer: 不能。分类可能合理，但订单号没有原文依据。应将缺失编号设为 null 并向用户询问。即使用户补充了编号，查询前仍需校验归属权限。Schema 验证、事实核查和授权是三个不同步骤。
sources:
  - id: openai-structured
    name: Structured model outputs
    url: https://developers.openai.com/api/docs/guides/structured-outputs
    publisher: OpenAI
    kind: 官方文档
    accessed: '2026-09-05'
    supports: 区分 JSON 模式与 Schema 约束，说明拒绝、未完成响应和字段内容仍可能出错的情况。
    limitation: 严格模式与支持的模型、Schema 子集和接口有关；不代表每次请求都返回完整可用业务结果。
  - id: json-schema
    name: Understanding JSON Schema — Objects
    url: https://json-schema.org/understanding-json-schema/reference/object
    publisher: JSON Schema
    kind: 标准规范
    accessed: '2026-09-05'
    supports: 解释对象属性、必填字段和额外属性的结构约束含义。
    limitation: JSON Schema 校验描述数据结构，不能单凭结构判断字段是否忠于来源或操作是否获授权。
  - id: google-structured
    name: Structured outputs
    url: https://ai.google.dev/gemini-api/docs/structured-output
    publisher: Google
    kind: 官方文档
    accessed: '2026-09-05'
    supports: 提供 Gemini 的结构化输出用法，并说明 Schema 子集与复杂度限制。
    limitation: 不应把 Gemini 的配置直接复制为其他供应商的 API 参数。
---

## 先分清三个层次

**合法 JSON：** 程序能解析这段文本，例如 `{"amount":"很多"}`。

**符合 Schema：** 字段和类型满足约定，例如 `amount` 必须是数值。Schema 是描述数据结构的规则，常包含 `properties`、`required` 和 `additionalProperties`。[2](#source-json-schema)

**业务正确：** 数值确实来自原文、单位一致、符合业务限制。即使前两层通过，这一层仍可能失败。OpenAI 文档也明确说明结构化输出仍可能包含内容错误。[1](#source-openai-structured)

## 给缺失信息留位置

教学任务：从客服留言提取分类和订单号。如果所有字段都必须是非空字符串，却又遇到没有订单号的消息，设计本身就在鼓励模型猜测。

应先约定：缺失用 `null`，无法分类用“其他”，需要确认的业务状态另行处理。“字段必须出现”和“字段必须有确定的值”不是同一个要求。

## 运行一个本地校验例子

下面只测试应用侧的结构校验，不请求模型、不使用 API 密钥。它使用本仓库已有的 Zod 依赖。把代码保存为仓库根目录的 `ticket-demo.mjs`，安装依赖后运行 `node ticket-demo.mjs`。

```js
import { z } from 'zod';

const Ticket = z
  .object({
    category: z.enum(['物流', '退款', '其他']),
    order_id: z
      .string()
      .regex(/^ORD-\d+$/)
      .nullable(),
  })
  .strict();

const examples = [
  { category: '物流', order_id: null },
  { category: '物流', order_id: 204 },
  { category: '物流', order_id: 'ORD-204' },
];

for (const [index, value] of examples.entries()) {
  console.log(`样例 ${index + 1}: ${Ticket.safeParse(value).success}`);
}
```

预期依次输出 `true`、`false`、`true`。第二条编号类型错误；第三条格式合法，但**如果原文没有这个编号，它依然是错误答案**。这个例子刻意展示校验器的边界，不是一段完整的生产集成。

## 接入模型还要处理哪些分支

1. 确认目标模型和接口支持什么约束；不要只在提示里写“必须输出 JSON”。
2. 分开处理正常结果、拒绝、响应截断和网络错误；遇到异常不要把部分文本当成完整数据。[1](#source-openai-structured)
3. 用应用代码再次校验数据，再检查原文依据和业务规则。
4. 限制重试次数，区分格式错误和事实缺失。没有依据的字段，重试不会凭空产生依据。

不同供应商支持的 JSON Schema 范围可能不同；例如 Gemini 文档明确列出 Schema 子集与复杂度限制。[3](#source-google-structured) 本文不提供一套声称跨厂商通用的请求参数。

## 怎么选择下一步

只想获得固定字段，先解决结构化输出。要让应用查询或修改外部系统，继续读 [工具调用](/glossary/tool-calling)。要知道字段是否真的提取得准，建立 [评测](/glossary/evaluation)，同时记录“结构通过率”和“字段正确率”。
