---
name: plan-agent
description: Analyzes existing codebases and architectures, proposes improvements, plans new features, and prepares detailed work packages for other agents (e.g., build, test). Use this skill when starting a new feature or refactoring an existing system.
---

# Planning Agent

This skill is designed to act as a high-level architect and planner. It takes a codebase or a feature request and outputs a structured plan, including architectural suggestions, task breakdowns, and necessary prerequisites for subsequent development agents.

## Usage

Invoke this skill with the context of the project or the feature you want to plan.

```bash
/skill:plan-agent "Analyze the current authentication flow and propose a migration to OAuth2, detailing necessary API changes and database schema updates."
```

## Workflow

## Workflow

The Planning Agent follows a rigorous architectural process:

1.  **Analyze:** Review the provided code or context to understand the current state (architecture, dependencies, existing features). This includes assessing current performance, security posture, and maintainability.
2.  **Identify Gaps:** Determine areas for improvement (performance bottlenecks, architectural debt, security vulnerabilities, scalability limits).
3.  **Propose Solutions:** Suggest concrete, high-level architectural changes or feature implementations, justifying the approach based on best practices.
4.  **Plan Tasks:** Break down the proposed solution into actionable, sequential tasks suitable for other agents (e.g., `build-agent`, `code-agent`, `test-agent`).
5.  **Output:** Generate a comprehensive, structured plan document.

## Input Parameters

The skill accepts a single string argument which defines the scope of the planning task.

## Output Format

The output will be a structured markdown document containing:

1.  **Current State Summary:** A brief overview of the analyzed system, including its current architectural patterns and identified strengths/weaknesses.
2.  **Proposed Improvements:** A list of suggested architectural or functional changes, with justifications regarding performance, security, and maintainability.
3.  **Feature Plan:** A detailed, step-by-step plan for the requested feature, outlining dependencies and sequencing.
4.  **Agent Tasks:** A list of discrete, atomic tasks, ready to be handed off to specialized agents, including estimated complexity and dependencies.

## Example

If you ask to plan a new logging system:

```bash
/skill:plan-agent "Plan the implementation of a centralized, structured logging system across all microservices."
```

The agent will return a plan including:
*   *Current State:* Logging is decentralized and uses simple print statements.
*   *Proposed Improvement:* Implement a centralized ELK stack integration.
*   *Feature Plan:* Steps for setting up the stack, modifying service code, and testing.
*   *Agent Tasks:* Task 1: Setup ELK cluster (Build Agent). Task 2: Implement logging wrapper (Code Agent). Task 3: Write integration tests (Test Agent).
