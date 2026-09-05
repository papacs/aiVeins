---
title: Prompt Engineering
slug: prompt-engineering
aliases: [提示工程]
category: 应用架构
level: 入门
status: verified
trend: 基础概念
last_verified: '2026-09-05'
summary: 设计和迭代模型指令、示例与输出要求，让模型在指定任务上更稳定地产生所需结果。
analogy: 像把任务说明写清楚：目标、边界、示例和验收标准越明确，返工越少。
solves: [澄清任务与输出要求, 用少量示例引导行为, 快速迭代模型表现]
boundaries: [提示无法补回缺失事实或工具, 再长的提示也不能替代评测和系统设计]
use_when: [任务能通过说明和示例改善, 需要低成本快速迭代]
avoid_when: [问题来自检索数据或权限, 逻辑应由确定性代码保证]
pitfalls: [堆砌万能咒语, 只用顺利样例调试, 系统提示无限膨胀]
related: [context-engineering, llm, evaluation, fine-tuning]
prerequisites: [llm]
learning_objectives:
  - 写出包含任务、资料边界和缺失信息处理的提示
  - 用固定样例判断一次提示修改是否真正改善结果
exercise:
  question: 提取订单号时，模型总把缺失的订单号补成一个看起来合理的编号。继续加入“务必准确”是否足够？你会如何修改和验证？
  answer: 不够。先明确缺失时输出 null 或待确认，提供一条缺失字段的示例，再检查接口是否支持相应的结构约束。用原来出错的样例和未参与调试的样例复测；若编号根本不在资料里，就不能靠加强语气补出事实。
sources:
  - id: openai-prompt
    name: Prompt engineering
    url: https://developers.openai.com/api/docs/guides/prompt-engineering
    publisher: OpenAI
    kind: 官方文档
    accessed: '2026-09-05'
    supports: 解释有效指令、提供相关上下文与通过评测迭代提示的基本做法。
    limitation: 文档中的模型与接口建议有适用范围，不应把某种提示写法当作跨模型保证。
  - id: google-prompt
    name: Prompt design strategies
    url: https://ai.google.dev/gemini-api/docs/prompting-strategies
    publisher: Google
    kind: 官方文档
    accessed: '2026-09-05'
    supports: 展示用清晰指令、具体示例和一致格式引导模型输出的方法。
    limitation: 示例针对 Gemini，示例数量和提示布局仍应在自己的任务与模型上验证。
---

## 好提示先回答四个问题

谁来读结果？要完成什么任务？允许依据哪些材料？缺少信息怎么办？把这些说清，比反复加入“你是顶级专家”“必须完美”更容易建立可检验的要求。官方指南把提示设计视作需要迭代的方法，而非保证结果的咒语。[1](#source-openai-prompt)

## 把模糊要求改成可验收任务

**教学示例：整理客服工单。** “分析下面内容并输出结果”没有规定要提取什么，也没有规定如何处理缺失信息。可以改成：

```text
任务：从 customer_message 中提取问题类型和订单号。
问题类型：物流、退款、其他，只能选一个。
依据：只能使用消息中明确出现的信息，不推测订单号。
缺失：没有订单号时记为 null；含义不清时类型记为“其他”。
输出：问题类型、订单号、作为判断依据的原文短句。
customer_message：包裹还没到，帮我查一下。
```

这段提示用于理解任务设计，并不是某家 API 的完整调用代码。若结果直接进入程序，还要配置 [结构化输出](/glossary/structured-output) 和业务校验。

## 示例什么时候有帮助

Few-shot prompting（少样本提示）是在输入中给出少量示例，展示你接受的分类边界或输出风格。Google 文档提供了这种方法的具体说明。[2](#source-google-prompt)

示例不应全是容易题。如果“多久到货”属于物流，“地址填错想取消”归退款还是其他，就需要写清规则。否则模型可能从几个例子中归纳出与你业务不同的边界。

也不要把调试样例同时当成最终测试集：已经针对它改过提示，答对它不足以证明能处理新输入。

## 一次只改一个假设

本站建议保存提示版本，并记录“预期修复什么”。例如：

1. 发现缺失订单号被编造，提出假设：缺失策略不明确。
2. 只增加缺失策略和一个反例，其他条件保持一致。
3. 同时检查编号缺失、编号正常、包含多个编号三类输入。
4. 记录错误数量和具体样例；确认修复没有让正常编号被丢弃。

如果错误来自过期资料，改提示通常不是第一步。先换正确资料；如果错误来自权限，应改应用控制；如果格式不稳定，应检查输出约束。

## 提示的能力边界

提示可以约束任务表达，但不能代替可信数据、权限检查或数学计算。外部文档里的“忽略之前指令”也不应被当作新的系统要求；仅用分隔符不能建立完整安全边界。

当你开始管理检索资料、对话历史、工具说明和中间结果时，问题已进入 [上下文工程](/glossary/context-engineering)。
