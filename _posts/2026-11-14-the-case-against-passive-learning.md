---
layout: post
title: "The Case Against Passive Learning"
date: 2026-11-14
categories: [ai, engineering]
tags: [learning, agents, evaluation, software-engineering]
description: "An implementation-driven approach to learning AI agents, integrations, and orchestration without mistaking either reading or demos for understanding."
---

*The most useful curriculum for AI engineering may be the one discovered while trying to build something that works. This is not an argument against theory. It is an argument for learning theory at the point where it can change an engineering decision.*

There is a peculiar problem with learning a rapidly developing technical field: the quantity of material available is not a good measure of its value. AI engineering now comes with an apparently endless supply of tutorials, agent frameworks, architectural diagrams, courses, and books. Much of it is easy to consume. Some of it is even easy to reproduce. Neither property establishes that one has learned much.

I see two tempting approaches, both inadequate in different ways. One is to assemble a comprehensive reading list and postpone implementation until the underlying theory feels complete. The other is to vibe code a succession of impressive-looking demonstrations, often by following frameworks or prompting coding assistants, without being able to explain why the systems behave as they do. The first can make preparation indefinite and the second can make progress nearly indistinguishable from the appearance of progress.

The alternative I find more convincing is **problem-directed learning** which is to choose a concrete engineering problem, read enough to make a plausible attempt, implement the mechanism, measure its behavior, and use its failures to decide what to study next. Reading supplies models; implementation creates observations; evaluation decides which models were useful. None of the three substitutes for the others.

## What counts as progress?

Suppose I read three articles about multi-agent orchestration and can now distinguish sequential, parallel, and delegated workflows. That is useful vocabulary. But I still cannot tell whether splitting a coding task among several agents improves task completion, or merely adds tool calls, latency, and new opportunities for coordination failure. The question is empirical, and reading alone cannot resolve it.

Conversely, I might implement a planner, a coding agent, and a verifier, then demonstrate them successfully changing a small repository. This is evidence that the components can interact at least once. It is not evidence that the architecture is reliable, superior to a single-agent baseline, or even necessary. A demonstration is a starting point for evaluation, not its replacement.

The distinction matters because working software is an unusually generous teacher and it can fail in ways that reveal precisely which concepts I do not understand. An agent that picks the wrong file raises questions about retrieval and context selection. An agent that edits the right file incorrectly raises questions about task specification and verification. An agent that hangs after a failed tool call raises questions about state, timeouts, and recovery. These failures are inconvenient, but they are much more informative than a vague feeling that I should "learn orchestration."

## How I divide my attention

I do not have a precise ratio for how much time I should spend building, testing, or reading. The appropriate balance changes with the problem. If I am trying to understand a new mechanism, a few hours spent reading its implementation or documentation might be more valuable than another few hours of writing code. If I already understand the relevant ideas, further reading can become a sophisticated form of procrastination.

In practice, I try to spend **more than half my time building something** which is implementing a capability, integrating components, or making a real system attempt a task. I devote the rest to **testing, debugging, reviewing what happened, and reading credible explanations of the mechanisms implicated by those failures**. The reading follows the questions raised by implementation. I might start with a tool call that fails intermittently, inspect its trace, discover that I do not understand the retry semantics, and then seek out the relevant documentation or technical explanation. That is a more specific reason to read than deciding in advance to spend a week learning everything about agents.

This is a preference, not a schedule I enforce mechanically. Some failures require substantial theoretical work; others are best understood by building a minimal reproduction. The underlying rule is to keep learning in contact with evidence. Building is not automatically productive if I cannot explain the code, and reading is not passive if it changes what I expect the system to do.

## The learning loop

The method can be reduced to five recurring steps, although in practice they overlap:

1. **Specify a capability.** Replace a broad ambition ("learn agents") with a behavior that can succeed or fail ("answer questions about a repository using only files the system can inspect").
2. **Read the minimum reliable theory.** Understand the agent loop, tool interface, and relevant constraints well enough to construct an initial implementation. Prefer authoritative explanations to arbitrary collections of patterns.
3. **Implement the smallest useful version.** Begin with explicit control flow and simple state. Avoid introducing a framework before knowing which complexity the framework is meant to remove.
4. **Test the behavior.** Record correctness, tool traces, latency, cost, and failure modes. A system that returns a plausible answer but consulted the wrong file has not necessarily succeeded.
5. **Investigate and revise.** Classify failures, study the missing concepts, change one important design choice, and run the tests again.

The important feature is that the last step feeds back into the second. The reading list is not fixed at the beginning: it is partly generated by encounters with reality.

This has a further advantage. When I return to a paper or technical explanation after a failed implementation, I already have questions to ask of it. Instead of remembering terminology in isolation, I can connect its claims to behavior I have observed. Even when the explanation is difficult, the reason for understanding it is no longer abstract.

## One project, revised eight times

Rather than building eight disconnected demos, currently I would use one evolving project that can inspect a repository, answer questions about code, propose changes, implement fixes, and verify the result. This is not because a coding agent is uniquely important. It is because the problem naturally exposes most of the mechanisms I want to understand, while giving me tasks with comparatively concrete outcomes.

Its evolution might look like this:

| Stage | New capability | What it forces me to understand |
|:--|:--|:--|
| 1 | Read files and search a repository | Agent loops, function calling, tool schemas |
| 2 | Select relevant context | Context engineering, retrieval |
| 3 | Use Git, a terminal, GitHub, and MCP tools | Integrations, permissions, safe execution |
| 4 | Plan and execute multi-step tasks | State representation and planning |
| 5 | Compare sequential, parallel, and delegated workflows | Orchestration and multi-agent tradeoffs |
| 6 | Run on a bug dataset with an evaluation harness | Golden test sets, success rates, regression tests |
| 7 | Survive retries, interruptions, and failed tools | Checkpoints, limits, durable execution |
| 8 | Run with isolation, logging, and deployment controls | Security, operations, and cost control |

The ordering is intentional. I would rather understand why a single agent cannot reliably locate the correct files before adding a second agent to help it. I would rather have a reproducible set of failing tasks before claiming that a new planning strategy is an improvement. And I would rather discover the costs of a particular workflow in an instrumented experiment than infer them from an architecture diagram.

The project should grow by addressing observed limitations. If the file-search implementation is sufficient for small repositories, there is little reason to add retrieval infrastructure immediately. If a single agent handles the task reliably, multiple agents need an affirmative case. *Complexity is a cost that requires a justification.*

## From architectural preference to falsifiable question

Consider the attractive claim that specialized planning, implementation, and verification agents outperform a single general-purpose agent on repository-level coding tasks. It is plausible. It is also easy to believe without having tested it.

I would turn that preference into an experiment:

**Hypothesis.** Specializing agents improves coding-task success sufficiently to justify the additional coordination.

**Comparison.** Give a single-agent design and a multi-agent design the same set of 30 repository tasks, with comparable models and budgets. Define successful completion before running either system, and hold the task set and evaluation criteria fixed.

**Measures.** Record task success, elapsed time, tool calls, token cost, and incorrect edits. Save traces rather than relying on the final answer alone.

**Failure analysis.** Separate failures caused by planning, missing context, unsuccessful tool calls, incorrect code changes, and coordination overhead. The aggregate success rate matters, but it does not tell me *why* one system did better.

**Decision.** Retain the additional agents only if the measured benefit is worth their complexity. If the multi-agent implementation wins a few tasks but substantially increases latency and cost, the decision is not automatic. Different applications may weigh these outcomes differently.

Thirty tasks would be a useful exploratory comparison, not decisive evidence for a universal claim.[^sample] The experiment would still be valuable because it would replace an architectural intuition with concrete observations and a list of failure modes to investigate.

There is also a less obvious benefit: evaluation changes the questions one asks while building. Without tests, I may focus on whether the agents communicate elegantly. With tests, I have to ask whether communication helped complete the task. An appealing abstraction can survive indefinitely in a demo; it has a harder time surviving a comparison against a simpler baseline.

## What should be learned before implementation?

Problem-directed learning does **not** imply that everything is best learned by trial and error. Some mistakes are too costly, too obscure, or too foundational to make experimentation a sensible first teacher. I would study the principles of authentication and authorization, concurrency and distributed state, information retrieval, statistical evaluation, transactional consistency, and LLM inference and tokenization early enough to avoid building on false assumptions.

Other subjects are especially amenable to iterative implementation: prompt construction, tool-interface design, retrieval-augmented generation tuning, agent evaluation workflows, planning heuristics, and orchestration patterns. Here, the useful details often emerge only when there is a particular model, tool set, task distribution, and failure mode to reason about.

This is a difference of emphasis rather than a division into "theory" and "practice." Retrieval has theoretical foundations worth learning; an actual retrieval pipeline still needs tuning. Statistical evaluation requires mathematical care; an evaluation harness still has to be implemented and maintained. Security requires prior understanding; real permissions and execution boundaries still have to be tested.

The point is to avoid two equally unhelpful slogans: "just build" and "learn everything first." Both avoid the harder question of what knowledge a particular decision requires.

## What a study session actually contains

Suppose I am building a plan–execute–verify workflow. I might begin by reading a credible explanation of the agent loop and the relevant tool semantics, just enough to form an initial design. Most of the session would go toward implementing it and making it attempt real tasks. Once it works, I would deliberately introduce ambiguous instructions, timeouts, failed tools, and recovery scenarios, then inspect the resulting traces.

I do not need to assign each phase a fixed number of minutes. A mysterious failure may deserve the rest of the session; a straightforward implementation may leave more room for experimentation. What matters is that I finish with something more informative than a working demonstration: a record of what the system did, where my expectations were wrong, and which mechanism I need to understand next.

That last part is particularly easy to neglect. A failed task without a recorded cause is merely an annoyance; a failure with a minimal reproduction and a proposed explanation is a research question. The next session can begin there instead of with another article chosen because its title sounds important.

## How I use AI without outsourcing the learning

AI assistants are part of this process, but there is an important difference between using them to accelerate an investigation and allowing them to do the investigation on my behalf. The latter can produce an impressive project while leaving my own understanding almost unchanged.

When I build, I use tools such as Cursor, Codex, and Claude Code to speed up repetitive implementation work, explore alternatives, write test fixtures, and inspect changes. But I want to own the critical mechanisms and be able to explain the tradeoffs. I would still implement a basic **agent loop, tool dispatcher, state manager, and evaluation harness** myself at least once, because those are precisely the abstractions I am trying to learn. Later, using a library for them may be sensible; reimplementing HTTP clients, databases, tokenizers, or schedulers is rarely the best use of the same time.

I find AI especially useful *after* something breaks. Rather than ask only for a patch, I can give ChatGPT or Claude a failing example, a trace, and my current explanation, then ask it to challenge that explanation. What assumptions might be wrong? What alternative mechanisms could produce the same symptom? What minimal experiment would distinguish them? Which official documentation, paper, or source code should I read to understand the underlying behavior? In this role, AI acts less like an answer generator and more like an interactive reviewer that helps me turn a confusing failure into a narrower question.

For example, suppose an agent repeatedly calls a tool even after a successful response. An assistant might propose several possibilities: the result was not added to the conversation state, the termination condition was too weak, or a retry path was triggered inadvertently. These are *hypotheses*, not diagnoses. I would inspect the state transitions, design a reproduction, and check the relevant implementation or documentation before deciding which explanation is supported. The same approach applies to concurrency bugs, retrieval failures, context-window problems, and incorrect agent plans.

I also use AI to help devise adversarial tests, identify hidden assumptions in my design, and compare a proposed fix against simpler alternatives. Its suggestions can broaden the search space of explanations. They cannot substitute for evaluating what actually happened. An AI-generated theory is easy to confuse with an explanation because it is coherent and immediate; the safeguard is to demand predictions, test those predictions, and retain the traces.

The same skepticism applies to fashionable architectural additions. Long-term memory, extra agents, elaborate planning graphs, and orchestration layers are not achievements by themselves. They are hypotheses about what a task requires. Their value should be measured against a simpler design, including their costs in failure recovery, observability, latency, and maintenance.

## A stronger test of understanding

My preferred standard is not whether I have finished a book, memorized a framework's API, or made a demonstration run. Those can all be intermediate accomplishments. The stronger question is whether I can **predict a system's behavior, explain where it fails, make a targeted change, and demonstrate that the change helped**.

That standard is demanding precisely because it resists easy proxies. A project can work accidentally. An explanation can sound coherent without predicting anything. A benchmark improvement can disappear when the tasks change. None of these observations is a reason to abandon implementation; they are reasons to combine it with theory and disciplined evaluation.

The resulting philosophy is not "practice beats theory." It is that **theory becomes more valuable when it is connected to a problem, and practice becomes more valuable when its results are examined**. I would rather work through one system deeply enough to understand its failure modes than accumulate a dozen shallow demonstrations or a reading list I cannot translate into meaningful engineering decisions.

---


[^sample]: Thirty tasks can reveal large differences and useful failure patterns, but conclusions will depend on task selection, run-to-run variability, and the budgets used. A serious comparative claim would require stronger evaluation design and replication.
