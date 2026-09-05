// 编辑整理的学习建议；事实依据与核验状态来自所引用的词条。

export const scenarios = [
  {
    id: 'knowledge-answer',
    question: '公司文档回答不准',
    hint: '先区分资料没找到，还是找到后答错。',
    keywords: ['公司文档', '回答不准', '知识库', '资料'],
    terms: ['rag', 'evaluation', 'vector-search'],
    comparison: 'rag-long-context',
  },
  {
    id: 'agent-choice',
    question: '该不该用 Agent',
    hint: '先判断任务步骤能否预先写清。',
    keywords: ['该不该', '自动执行', '任务步骤', 'agent'],
    terms: ['workflow', 'agent', 'guardrail'],
    comparison: 'agent-workflow',
  },
  {
    id: 'forgot-history',
    question: '模型总忘记之前的信息',
    hint: '分清当前上下文、历史与长期记忆。',
    keywords: ['忘记', '历史', '记忆', '之前的信息'],
    terms: ['context-engineering', 'memory', 'knowledge-base'],
    comparison: 'memory-knowledge',
  },
];

export const paths = [
  {
    id: 'foundations',
    outcome: '能区分模型生成、工具执行与 Agent 决策。',
    exercise:
      '选一个日常任务，写出模型负责什么、工具负责什么，以及如何判断结果合格。',
    audience: '零基础',
    title: '从模型到能做事的 Agent',
    time: '约 45 分钟',
    summary:
      '先建立模型、上下文与工具的基本直觉，再理解 Agent 为什么需要工作流、评测和护栏。',
    terms: [
      ['LLM', 'llm'],
      ['提示工程', 'prompt-engineering'],
      ['上下文工程', 'context-engineering'],
      ['工具调用', 'tool-calling'],
      ['Agent', 'agent'],
      ['评测', 'evaluation'],
    ] as [string, string][],
  },
  {
    id: 'rag-system',
    outcome: '能定位回答错误发生在检索还是生成环节。',
    exercise:
      '挑选五个真实问题，逐个记录正确资料是否被召回、回答是否忠于资料。',
    audience: '知识库实践者',
    title: '做一个靠谱的 RAG 系统',
    time: '约 35 分钟',
    summary:
      '从内容如何表示开始，分清检索、知识库、长上下文和微调各自负责什么。',
    terms: [
      ['Embedding', 'embedding'],
      ['向量检索', 'vector-search'],
      ['知识库', 'knowledge-base'],
      ['RAG', 'rag'],
      ['长上下文', 'long-context'],
      ['微调', 'fine-tuning'],
    ] as [string, string][],
  },
  {
    id: 'application',
    outcome: '能为模型调用设计权限、失败处理与验收条件。',
    exercise:
      '画出一个工具调用流程，标出参数校验、人工确认和失败后的退出位置。',
    audience: '应用开发者',
    title: '把模型安全接进产品',
    time: '约 40 分钟',
    summary: '从固定工作流起步，再逐步加入工具、开放协议、自主决策和安全控制。',
    terms: [
      ['Workflow', 'workflow'],
      ['Tool Calling', 'tool-calling'],
      ['MCP', 'mcp'],
      ['Agent', 'agent'],
      ['Guardrail', 'guardrail'],
      ['Evaluation', 'evaluation'],
    ] as [string, string][],
  },
];

export const comparisons = [
  {
    id: 'agent-workflow',
    relationship: '可组合的控制方式',
    constraint: '先判断步骤能否预先确定，再比较失败恢复、延迟和人工介入成本。',
    validation:
      '用同一组真实任务比较固定流程与自主循环，记录完成率、调用次数与失败原因。',
    caveat: '动态任务也可能包含固定子流程；允许自主决策不等于允许无限重试。',
    left: 'Agent',
    leftSlug: 'agent',
    right: 'Workflow',
    rightSlug: 'workflow',
    question: '任务路径是否能预先写清？',
    verdict:
      '能写清就先用 Workflow；只有中间结果持续改变下一步时，再把控制权交给 Agent。',
    leftGood: '开放目标、动态环境、需要自主选择工具',
    rightGood: '固定步骤、稳定分支、强调可预测性',
  },
  {
    id: 'rag-long-context',
    relationship: '可组合的资料组织方式',
    constraint: '比较资料量、更新频率、上下文容量、延迟和每次请求成本。',
    validation:
      '对同一组问题分别提供全文和检索片段，检查答案依据、遗漏与调用成本。',
    caveat: '需要引用并不意味着只能用 RAG；长上下文同样需要验证引用是否正确。',
    left: 'RAG',
    leftSlug: 'rag',
    right: '长上下文',
    rightSlug: 'long-context',
    question: '资料应该先筛选，还是一次全读？',
    verdict:
      '资料持续增长或需要引用时优先 RAG；材料有限且整体关系重要时可直接用长上下文，也可以组合。',
    leftGood: '大规模、常更新、需追溯的资料库',
    rightGood: '单份长文档、代码库、整体综合任务',
  },
  {
    id: 'rag-fine-tuning',
    relationship: '解决不同问题，可组合',
    constraint: '先分清缺少事实依据还是行为不稳定，并确认有可重复的评测样本。',
    validation:
      '分别提供正确资料和改进指令，观察错误是否减少，再判断是否需要训练。',
    caveat: '事实与行为问题可能同时存在，不能仅凭一次回答就决定微调。',
    left: 'RAG',
    leftSlug: 'rag',
    right: 'Fine-tuning',
    rightSlug: 'fine-tuning',
    question: '需要新知识，还是稳定行为？',
    verdict:
      '更新事实用 RAG；改变风格、格式或专项能力才考虑微调。没有评测集时不要急着微调。',
    leftGood: '外部事实、私有资料、最新内容',
    rightGood: '行为模式、输出风格、专项能力',
  },
  {
    id: 'mcp-tool-calling',
    relationship: '不同层次，可配合使用',
    constraint: '先确认是否需要跨客户端复用连接，再明确认证、权限与执行责任。',
    validation: '沿一次调用标出模型提议、应用校验、协议传输和实际执行的位置。',
    caveat: '采用连接协议不会自动保证模型选对工具，也不会替代应用的权限检查。',
    left: 'MCP',
    leftSlug: 'mcp',
    right: 'Tool Calling',
    rightSlug: 'tool-calling',
    question: '是连接协议，还是模型发起动作？',
    verdict:
      'Tool Calling 是模型提出结构化调用；MCP 规范了应用如何发现并连接可复用的工具、资源与提示。',
    leftGood: '跨客户端复用、标准化连接',
    rightGood: '单个应用内让模型选择函数',
  },
  {
    id: 'prompt-context',
    relationship: '局部与整体',
    constraint: '先判断失败源于指令表达，还是资料、工具、历史与状态的组织。',
    validation: '固定模型与问题，一次只调整指令或资料输入，记录效果差异。',
    caveat: '增加上下文不必然改善结果；重复、冲突和无关信息也需要处理。',
    left: 'Prompt Engineering',
    leftSlug: 'prompt-engineering',
    right: 'Context Engineering',
    rightSlug: 'context-engineering',
    question: '是在写指令，还是组织整个信息环境？',
    verdict:
      'Prompt Engineering 改善任务表达；Context Engineering 还管理资料、工具、历史、记忆与中间状态。',
    leftGood: '单次任务、指令与示例优化',
    rightGood: '多步系统、动态资料与状态管理',
  },
  {
    id: 'memory-knowledge',
    relationship: '职责不同，可共享存储设施',
    constraint: '明确数据属于谁、有效期、更新方式，以及查看和纠正权限。',
    validation:
      '把样例数据分成用户偏好、任务状态和组织文档，分别写出更新与删除规则。',
    caveat: '同一数据库可以承载多类数据，存储位置本身不能决定概念边界。',
    left: 'Memory',
    leftSlug: 'memory',
    right: 'Knowledge Base',
    rightSlug: 'knowledge-base',
    question: '保存的是经历，还是可维护事实？',
    verdict:
      'Memory 面向某个用户或 Agent 的历史与状态；知识库面向可治理、可共享、可更新的事实来源。',
    leftGood: '偏好、任务进展、经验摘要',
    rightGood: '文档、政策、产品资料、组织知识',
  },
];

export const radarItems = [
  {
    id: 'agent-harness',
    status: '快速演变',
    title: 'Agent Harness',
    slug: 'context-engineering',
    summary:
      '从“选哪个 Agent 框架”转向“怎样组织上下文、工具、权限、循环和执行环境”。',
    learn:
      '先理解它是一组系统能力，而不是某个单独库。重点看上下文管理、权限边界与可观测性。',
  },
  {
    id: 'context-engineering',
    status: '当前热门',
    title: 'Context Engineering',
    slug: 'context-engineering',
    summary:
      '关注点从写一段好 Prompt，扩展到让模型在每一步看到恰好需要的信息。',
    learn:
      '理解 Prompt 只是上下文的一部分，并学会在资料、工具、历史和成本之间取舍。',
  },
  {
    id: 'mcp',
    status: '快速演变',
    title: 'MCP',
    slug: 'mcp',
    summary: '协议生态快速扩张，同时规范、授权方式与能力模型仍在变化。',
    learn:
      '先掌握 Host / Client / Server 与资源、提示、工具三类原语；实现时固定协议版本。',
  },
  {
    id: 'memory',
    status: '存在争议',
    title: 'Agent Memory',
    slug: 'memory',
    summary:
      '“记忆”常被混用于聊天历史、用户偏好、任务状态、经验总结和外部知识。',
    learn:
      '不要先选数据库。先明确要记什么、为什么记、保存多久、谁能查看和纠正。',
  },
];
