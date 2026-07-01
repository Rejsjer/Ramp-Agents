---
name: "Agent Designer"
description: "Designs and orchestrates multi-agent systems with tool schemas and performance evaluation"
version: "1.0"
author: "Ramp-Agent"
created: "2026-07-01"
status: "active"
type: "specialized"

applyTo:
  - projects: ["any"]
  - domains: ["agent-orchestration", "system-design", "multi-agent-systems"]

capabilities:
  - multi-agent-orchestration
  - tool-schema-design
  - agent-coordination
  - performance-evaluation
  - workflow-optimization

skills:
  - claude-mem
  - task-observer
  - impeccable

hooks:
  preToolUse: true
  postToolUse: true
  agentStop: true
  feedbackLoop: true

permissions:
  autoApproval: true
  approvalThreshold: 0.35
  maxConcurrentTasks: 2
---

## When to Use This Skill

- Design multi-agent systems for complex tasks
- Define tool schemas for agent communication
- Orchestrate agent workflows and coordination
- Evaluate agent performance and bottlenecks
- Optimize agent resource allocation
- Debug agent interaction issues
- Scale agents from prototype to production
- Design fallback and recovery mechanisms

## How It Works

### Agent System Architecture

**Single Agent (Simple)**
```
User → Agent → Tools → Result
```

**Multi-Agent (Complex)**
```
                    ┌─ Agent A (Analyzer)
User → Orchestrator ├─ Agent B (Implementer)
                    ├─ Agent C (Reviewer)
                    └─ Agent D (Documenter)
```

### Key Components

**1. Agent Definition**
- Role and responsibilities
- Capabilities (what tools it can use)
- Constraints (rate limits, resource budgets)
- Personality/tone
- Success criteria

**2. Tool Schema**
- Input parameters (types, constraints)
- Output format (structured, unstructured)
- Error handling
- Side effects
- Rate limits

**3. Coordination Layer**
- Message passing between agents
- Workflow orchestration
- Dependency management
- Fallback strategies
- Resource allocation

**4. Performance Metrics**
- Agent success rate
- Task completion time
- Tool invocation count
- Error rates
- Resource usage

## Instructions

### Phase 1: System Design

1. **Define Problem**
   - What task needs to be accomplished?
   - What's the complexity?
   - What are the constraints (time, cost, quality)?
   - What's the success criteria?

2. **Design Agent Structure**
   - How many agents do we need?
   - What's each agent's role?
   - How should they interact?
   - What's the orchestration pattern?

3. **Identify Required Tools**
   - What capabilities does each agent need?
   - What's the interface for each tool?
   - What are error conditions?
   - What are the rate limits?

### Phase 2: Tool Schema Definition

**Example Tool Schema:**
```yaml
tool_name: "analyze_code"
description: "Analyze code for quality issues"

input_schema:
  type: "object"
  properties:
    code:
      type: "string"
      description: "Source code to analyze"
    language:
      type: "string"
      enum: ["python", "javascript", "go"]
    depth:
      type: "string"
      enum: ["quick", "thorough"]
      default: "thorough"
  required: ["code", "language"]

output_schema:
  type: "object"
  properties:
    issues:
      type: "array"
      items:
        type: "object"
        properties:
          type: { type: "string" }
          severity: { enum: ["low", "medium", "high"] }
          line: { type: "number" }
          message: { type: "string" }
    score: { type: "number", minimum: 0, maximum: 100 }
    summary: { type: "string" }

rate_limit: "10 calls per minute"
timeout: "30 seconds"
```

### Phase 3: Agent Coordination

**Sequential Pattern** (Linear workflow)
```
Agent A → Agent B → Agent C → Result
```
- Predictable, simple
- Slower (agents wait for previous)
- Use when order matters

**Parallel Pattern** (Independent work)
```
Agent A ┐
Agent B ├→ Aggregator → Result
Agent C ┘
```
- Fast (agents work simultaneously)
- Scalable
- Use when work is independent

**Hierarchical Pattern** (Delegating)
```
Main Agent
    ├─ Sub-Agent 1
    ├─ Sub-Agent 2
    └─ Sub-Agent 3
```
- Organized, easy to manage
- Scales well
- Use for complex decomposition

**Mesh Pattern** (Full communication)
```
Agent A ←→ Agent B
  ↕       ↕
Agent D ←→ Agent C
```
- Flexible, adaptive
- Complex coordination
- Higher resource cost
- Use when agents need peer negotiation

### Phase 4: Performance Evaluation

**Metrics to Track:**

| Metric | Calculation | Target |
|--------|-------------|--------|
| Success Rate | (Completed / Total) × 100 | >95% |
| Latency | Time from request to result | <30s |
| Tool Usage | Avg tools per task | Minimize |
| Error Rate | (Errors / Total) × 100 | <5% |
| Cost per Task | Total cost / tasks completed | Budget-dependent |
| Agent Utilization | Active time / total time | >80% |
| Coordination Overhead | Coordination time / task time | <20% |

**Bottleneck Analysis:**
```
Total Task Time = Agent Time + Coordination Time + Tool Wait Time

If Coordination Time > 20%: Optimize message passing
If Tool Wait Time > 50%: Add caching or parallel tools
If Agent Time > 60%: Improve agent efficiency or split task
```

## Multi-Agent Patterns

### Pattern 1: Critique Loop
```
Agent (Generator) → Agent (Critic) → Feedback → Generator Iterates
```
- Good for: Iterative refinement
- Examples: Code review, writing improvement

### Pattern 2: Specialized Skills
```
Orchestrator
    ├─ Analyzer (understands requirements)
    ├─ Implementer (builds solution)
    ├─ Reviewer (QA checks)
    └─ Documenter (writes docs)
```
- Good for: End-to-end project execution
- Examples: Software development, content creation

### Pattern 3: Ensemble
```
Agent A \
Agent B  ├→ Aggregator (majority vote) → Result
Agent C /
```
- Good for: High-stakes decisions
- Examples: Risk assessment, diagnostics

### Pattern 4: Routing
```
Orchestrator (classifies task)
    ├─ Router A (type X tasks)
    ├─ Router B (type Y tasks)
    └─ Router C (type Z tasks)
```
- Good for: Task-specific expertise
- Examples: Customer support, content routing

## Tool Schema Validation

```yaml
Validation Rules:
- All parameters have types and descriptions
- Required parameters clearly marked
- Default values appropriate
- Rate limits realistic
- Timeout values reasonable
- Error conditions documented
- Output schema matches examples
- No circular dependencies
```

## Implementation Checklist

- [ ] Problem requirements defined
- [ ] Agent structure designed
- [ ] Tool schemas documented
- [ ] Coordination pattern chosen
- [ ] Communication protocol defined
- [ ] Error handling designed
- [ ] Fallback strategies planned
- [ ] Performance targets set
- [ ] Monitoring/metrics configured
- [ ] First version implemented
- [ ] Agents tested individually
- [ ] Integration tests passed
- [ ] Performance baseline measured
- [ ] Optimization iterations done
- [ ] Production deployment planned
- [ ] Results logged to CLAUDE.md

## Debugging Multi-Agent Issues

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| Slow execution | Coordination overhead | Switch to parallel pattern |
| High error rate | Agents not handling edge cases | Add error handling, clearer specs |
| Agents conflicting | Poor coordination | Add explicit handoff rules |
| Tool timeouts | Tools too slow | Optimize tools, add caching, increase timeout |
| Cascading failures | One agent failure breaks all | Add fallbacks, circuit breakers |
| Deadlock | Agents waiting on each other | Change coordination pattern |

## Notes

- Start with simple patterns, add complexity only if needed
- Measure performance before and after changes
- Agents benefit from clear, documented responsibilities
- Tool schemas should be as strict as possible
- Updates CLAUDE.md with architecture decisions and learnings
- Integrates with usage tracking for optimization insights
