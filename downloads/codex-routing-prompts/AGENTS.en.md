# AI Model Usage Guidelines

Subagents / multi-agent / parallel agents are allowed.

## 1. Subagent usage principles

Use a subagent only when the task can be clearly split and the parallel payoff exceeds the dispatch cost.

Simple, small, single-point tasks are handled directly by the main thread.

Subagents only handle well-scoped subtasks with clear inputs and verifiable outputs.

Final judgment, solution integration, and high-risk decisions stay on the main thread.

## 2. Smart scheduling principles

Pick the model by task risk and code size first, then tune reasoning_effort by difficulty.

reasoning_effort cannot replace a stronger model; complex code review, cross-module judgment, and high-risk fixes must not use lightweight models.

When task complexity is uncertain, start with the more conservative model config to avoid misjudgment from an underpowered subagent.

## 3. Model and reasoning_effort rules

- Ultra-light tasks use a lightweight model (e.g. gpt-5.6 luna) with reasoning_effort=low or medium. Examples: file lookup, simple search, command-output summary, single-fact checks, list cleanup.
- Simple read-only tasks use a lightweight model with reasoning_effort=medium or high. Examples: multi-file search, log digest, test-failure summary, read-only MCP queries. Not for code review verdicts — facts and evidence only.
- Small code read-only / local review uses a lightweight model with reasoning_effort=medium. Examples: 1-2 files, clear boundaries, no cross-module impact, local risk checks.
- Medium-scale code tasks use a mid-tier model (e.g. gpt-6-astra or gpt-5.6 sol) with reasoning_effort=medium or high. Examples: module-level reading, local implementation, bug triage, test fixes, ordinary code review.
- If business state machines, concurrency, permissions, payments, DB writes, or data consistency are involved, go directly to a strong model (e.g. gpt-5.6 sol).
- Complex tasks use a strong model with reasoning_effort=high. Examples: complex review, cross-module impact analysis, high-risk fixes, architecture judgment, key business-flow validation.
- Architecture-level decisions, final integration, and key acceptance use the top model (e.g. gpt-6-astra), with reasoning_effort=xhigh when necessary.
- If the user explicitly specifies a model or reasoning_effort, follow the user.

## 4. Code review rules

- Real code review must not use a lightweight model.
- Small, low-risk code review uses at least a lightweight model at medium.
- Medium/high-risk, cross-file, cross-module, business-critical-path review uses gpt-6-astra at high.
- Security, payments, refunds, DB writes, concurrency locks, permissions, and production deployment review use gpt-6-astra at high or xhigh.

## 5. Tool / MCP call rules

- Single, blocking tool calls that immediately decide the next step are executed by the main thread.
- Multiple independent, read-only, parallelizable searches, log digests, and MCP queries can go to lightweight subagents.
- Tool calls that write files, write databases, delete/move, escalate privileges, or decide key business outcomes are executed by the main thread or confirmed by it.

## 6. Context and token control

- When using subagents, do not fork full context by default; prefer fork_context=false.
- Give subagents concise, independent, well-scoped briefs.
- Use fork_context=true only when the subtask truly depends on the full history.
- Avoid multiple subagents analyzing the same question repeatedly.

# Subagent Use

Subagents are your scouts. Treat them as the most convenient tool at hand for "wide and heavy" reads.

You must follow this: call subagents more aggressively and more frequently, whenever needed and not only at the start of a conversation. More frequent subagent calls avoid context rot; the main thread plays the subagent orchestrator.

## When to handle directly

Read and process the following directly, without spawning a subagent:

- Small files at known locations, little code, or a single fact;
- The exact code about to be modified;
- Tasks where dispatch, waiting, and review cost no less than reading them yourself.
- Foundational documents, no matter how long: architecture docs, design docs, handover memos — their value lies entirely in details and context, lost the moment a subagent paraphrases them; length is no reason to outsource.

## When to dispatch

- Huge files (except foundational documents), cross-file or cross-directory retrieval;
- Independent, parallelizable exploration or verification;
- Re-confirming module status during long tasks;
- Reads that produce large amounts of logs, search results, or peripheral material.

Multiple independent tasks should be dispatched concurrently.

## Delegation and verification

- Subagent briefs must be self-contained: state the retrieval scope, the specific question, and the expected output. When precision matters, require file:line, symbol names, and key original text — these citations are the handle for cheap review.
- Subagent results are only leads; they may miss things or err. Review = follow the cited file:line and key text, spot-checking the few parts that truly require the main agent's own reading. Do not re-read the whole material — that refunds the compression on the spot.
- The only two things the main agent must read in full are: the exact code about to be modified, and foundational documents. Subagents help at most with locating; the reading is done by the main agent.
- Subagents only explore, retrieve, and verify by default. Code changes, solution trade-offs, and final verification are the main agent's responsibility.

## Dispatch mechanics

- Whether and how many to dispatch is decided autonomously by the main agent, without the user asking; heavier exploration should be split into multiple independent light tasks dispatched concurrently.
- Up to 6 subagents may run in parallel; subagent models are cheap, so use them aggressively whenever tasks need it.
- Subagents use the default configuration, explicitly specifying agent_role = "default". Always pass fork_turns = "none" when spawning, not copying the main agent's history, so every scout stays clean, fast, and unburdened by the main agent's rotting context.
- When multiple subagents are needed, dispatch them concurrently in the same round; after dispatching, the main agent immediately wait_agent and stops all other analysis, retrieval, command execution, and file modification until all return.
- After receiving a subagent's result, close it immediately; each subagent is single-use, never reused or followed up.
- A subagent still running 10 minutes after spawn is an anomaly: the main agent must intervene and not keep waiting blindly; check the agent status or run log, adopt partial results when available, then stop the subagent and decide whether to re-dispatch or split into smaller tasks.
