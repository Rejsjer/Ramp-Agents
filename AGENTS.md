# AGENTS.md - Agent Registry

**Last Updated:** 2026-07-01  
**Total Agents:** 4  
**Active Personas:** 4  
**Available Templates:** 10+  

---

## Registered Agent Personas

### Executive Advisors (C-Level)

| Persona | Role | Specialization | Status |
|---------|------|-----------------|--------|
| CEO Advisor | Chief Executive Officer | Business strategy, growth, execution | Active |
| CTO Advisor | Chief Technology Officer | Architecture, scaling, tech strategy | Active |
| CFO Advisor | Chief Financial Officer | Financial planning, unit economics | Active |
| Growth Manager | Chief Marketing Officer | Marketing, campaigns, analytics | Active |

---

## Creating Custom Agents

### Template for Custom Agents

```yaml
---
name: "Agent Name"
description: "What this agent does"
status: "active|archived|experimental"
created: "2026-07-01"
specialization: "domain or type"

configuration:
  file: "agents/AGENT_NAME.md"
  skills: ["skill-1", "skill-2"]
  hooks:
    - "pre-tool-use"
    - "post-tool-use"
    - "feedback-loop"
  
sessions:
  maxConcurrent: 1
  timeout: 3600000
  autoCompact: true
  
projects:
  - "project-name"
  
targetThreshold: 0.35
```

---

## Available Skills by Category

### Core Skills (14)
- claude-mem, superpowers, find-skills, impeccable
- task-observer, reactbits.dev, agent-browser, playwright
- scrapling, agent-reach, headroom, ponytail, stop-slop, markitdown

### Engineering Skills (4)
- **security-auditor** - Vulnerability and malicious code scanning
- **rag-architect** - RAG pipeline design and optimization
- **changelog-generator** - Changelog generation from commits
- **agent-designer** - Multi-agent orchestration design

### SaaS Automation Connectors (3)
- **saas-crm-connector** - Salesforce, HubSpot, Pipedrive, Close, Zoho
- **saas-pm-connector** - Jira, Asana, Linear, Monday.com, ClickUp
- **saas-communication-connector** - Slack, Discord, Teams, Telegram

### Executive Personas (4)
- **CEO Advisor** - Business strategy and execution
- **CTO Advisor** - Technical architecture and strategy
- **CFO Advisor** - Financial planning and unit economics
- **Growth Manager** - Marketing and growth strategy

---

## Agent Quick Reference

To create a new agent:

1. **Copy the base config:**
   ```bash
   cp agents/BASE-AGENT-CONFIG.md agents/MY-AGENT.md
   ```

2. **Choose your persona or create custom:**
   - Executive? Copy from `skills/enterprise-personas/`
   - Marketing? Copy from `skills/marketing/`
   - Engineering? Copy from `skills/engineering/`
   - Custom? Start from BASE-AGENT-CONFIG.md

3. **Update the YAML frontmatter**
   - name, description, type
   - applyTo (projects/domains)
   - capabilities, skills
   - role (if persona)

4. **Customize the instructions**
   - Behavior for this specific agent
   - How it differs from template
   - Decision frameworks
   - Success criteria

5. **Register in AGENTS.md**
   - Add to Active Agents table
   - Link to configuration file
   - Note specialization

6. **Test in isolated session**
   - Session 1-4 in tracking
   - Verify hooks work
   - Check memory loading
   - Validate skill access

---

## Usage Examples

### Example 1: General Purpose Agent

```yaml
name: "General-Purpose"
specialization: "multi-domain"
skills: ["claude-mem", "task-observer", "stop-slop"]
```

### Example 2: Code Generation Agent

```yaml
name: "Code-Gen"
specialization: "code-generation"
skills: ["impeccable", "markitdown", "task-observer"]
capabilities: ["code-generation", "documentation"]
```

### Example 3: Testing Agent

```yaml
name: "Tester"
specialization: "testing"
skills: ["playwright", "stop-slop", "task-observer"]
capabilities: ["testing", "qa"]
```

### Example 4: Security-Focused Agent

```yaml
name: "Security-Agent"
specialization: "security"
skills: ["security-auditor", "impeccable", "task-observer"]
capabilities: ["vulnerability-scanning", "code-audit"]
```

### Example 5: Automation Agent

```yaml
name: "Automation-Orchestrator"
specialization: "saas-automation"
skills: ["saas-crm-connector", "saas-pm-connector", "saas-communication-connector"]
capabilities: ["workflow-automation", "data-sync", "notifications"]
```

### Example 6: Full Stack Growth Agent

```yaml
name: "Growth-Agent"
specialization: "growth"
extends: "skills/marketing/growth-manager-persona.md"
skills: ["growth-manager-persona", "saas-crm-connector", "saas-communication-connector"]
capabilities: ["growth-strategy", "campaign-management", "analytics"]
```

---

## Notes

- **User-Managed Sessions:** Max 4 parallel (sessions 1-4)
- **Sub-Agent Sessions:** Unlimited (Claude-orchestrated internally)
- All agents share CLAUDE.md memory
- All agents contribute to usage tracking
- Feedback loop applies to all agents
- Sub-agents aggregate metrics back to parent agent
- Personas are templates—customize for your org
- Skills can be combined in any agent
