# Contributing to Ramp-Agent

**Status:** Production System  
**Contribution Level:** Individual Use + Team Extensions  

---

## Overview

This system is designed for:
1. **Individual use** - Your personal learning and workflow system
2. **Team extensions** - Adding skills, agents, and workflows
3. **Organization scaling** - Expanding to team-wide usage

---

## How to Contribute

### Adding Your Learnings

**Update `memory/CLAUDE.md`:**

```markdown
## [Your Name]'s Learnings

### [Date]: [What You Learned]
- **Discovery:** [How you found it]
- **Impact:** [Why it matters]
- **Solution:** [How to use it]
- **Reference:** [Where it's documented]
```

**When to add:**
- After discovering something new
- When optimizing a workflow
- When solving a recurring blocker
- When finding a pattern

### Creating New Skills

If you develop a useful skill:

1. Create skill file: `skills/[category]/[skill-name].md`
2. Follow [SKILL.md template format](skills/registry.json)
3. Add to `skills/registry.json` with metadata
4. Test with agent tasks
5. Commit to repo

**Example:**

```bash
# Create skill
cp skills/SKILL-TEMPLATE.md skills/engineering/my-skill.md

# Edit with your skill
code skills/engineering/my-skill.md

# Add to registry
# (Update skills/registry.json)

# Test it
# (Run agent tasks using your skill)

# Commit
git add skills/engineering/my-skill.md skills/registry.json
git commit -m "Add my-skill for [purpose]"
```

### Creating New Workflows

**Document what works:**

```bash
# Create workflow template
cp workflows/WORKFLOW-TEMPLATE.md workflows/my-workflow.md

# Document steps, inputs, outputs
code workflows/my-workflow.md

# Track performance
# (System tracks in tracking/workflow-stats.json)

# Commit
git add workflows/my-workflow.md
git commit -m "Add my-workflow for [task type]"
```

### Creating New Personas

If you need a specialized agent persona:

```bash
# Create persona
cp skills/enterprise-personas/PERSONA-TEMPLATE.md skills/enterprise-personas/my-persona.md

# Define role, capabilities, decision framework
code skills/enterprise-personas/my-persona.md

# Add to AGENTS.md
# Commit
git add skills/enterprise-personas/my-persona.md AGENTS.md
git commit -m "Add my-persona for [role]"
```

### Improving Documentation

**Fix or enhance docs:**

1. Find the document that needs improvement
2. Make the change
3. Commit with clear message

```bash
git add SYSTEM-COMPLETE.md
git commit -m "Clarify context routing explanation"
git push
```

---

## Contribution Guidelines

### Coding Standards

**JavaScript Files:**
- Use meaningful variable names
- Include comments for complex logic
- Follow existing code style
- Test before committing

**Example:**

```javascript
/**
 * Record workflow execution for learning
 * @param {string} workflowName - Name of workflow
 * @param {object} execution - Execution details
 */
function recordWorkflowExecution(workflowName, execution) {
  // Implementation
}
```

### Documentation Standards

**Markdown Files:**
- Clear, concise writing
- Proper heading hierarchy
- Code examples where relevant
- Links to related docs

### Commit Message Format

```
Type: Brief description

Detailed explanation if needed

- Bullet point 1
- Bullet point 2

References: Related files or issues
```

**Types:**
- `Feature:` - New skill, workflow, or persona
- `Docs:` - Documentation update
- `Learning:` - New learnings in CLAUDE.md
- `Optimization:` - Performance improvement
- `Fix:` - Bug fix
- `Refactor:` - Code improvement

**Examples:**

```
Feature: Add new RAG evaluation skill

Added comprehensive RAG pipeline evaluation skill with:
- Metric calculation
- Benchmark comparison
- Improvement suggestions

Skills: rag-architect, agent-designer
docs: LEARNING-SYSTEM.md
```

```
Learning: Cache strategy for search significantly improves speed

Discovered: Caching at multiple levels (query, index, results)
provides 3-5x speedup compared to no caching

- Query cache: 1-5s queries
- Index cache: Warm indexes reduce time 40%
- Results cache: Frequently accessed 10x faster

Reference: memory/CLAUDE.md
```

### What to Commit

**✅ Always commit:**
- Skill files (`.md` in `skills/`)
- Workflow files (`.md` in `workflows/`)
- Persona files (`.md` in `skills/enterprise-personas/`)
- Updates to `skills/registry.json`
- Updates to `AGENTS.md`
- Learnings in `memory/CLAUDE.md`
- Documentation improvements
- New project contexts
- Updated user profile (if shared)

**❌ Don't commit:**
- `tracking/usage-stats.json` - Auto-generated
- `tracking/workflow-stats.json` - Auto-generated
- Active `sessions/session-*.md` files
- `.env` - Local settings
- `node_modules/` - Dependencies
- Local IDE settings

### Pull Request Process (if team-based)

1. Create feature branch: `git checkout -b feature/my-skill`
2. Make changes
3. Commit with clear messages
4. Push to remote: `git push origin feature/my-skill`
5. Create pull request with description
6. Address review comments
7. Merge when approved

---

## Sharing Your Improvements

### Share a Skill

```markdown
# New Skill: [Name]

**Purpose:** [What it does]
**Use Case:** [When to use it]

**Example:**
[Show usage example]

**Benefits:**
- [Benefit 1]
- [Benefit 2]

**Location:** skills/[category]/[skill-name].md
**Status:** Ready for use
```

### Share a Workflow

```markdown
# New Workflow: [Name]

**Purpose:** [What it accomplishes]
**Success Rate:** [% of successful runs]
**Avg Time:** [Time to complete]

**Steps:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Best For:** [When to use this workflow]
**Blockers to Watch:** [Common issues]

**Performance Trend:** improving / stable / degrading
**Last Updated:** [Date]
```

### Share Learnings

Post in `memory/CLAUDE.md` with format:

```markdown
## [Your Discovery]

**Date:** YYYY-MM-DD  
**Discoverer:** Your name  
**Impact:** [Why it matters]

### Detailed Learning
[Explain what you learned]

### How to Use It
[Explain how to apply it]

### Resources
- Reference 1
- Reference 2

### Status
[Implementation status]
```

---

## Workflow: Adding a New Skill

### 1. Identify Need

```
"We need better X handling"
```

### 2. Design Skill

Think about:
- Purpose and use cases
- Dependencies (which other skills)
- Inputs and outputs
- Example scenarios

### 3. Create Skill File

```bash
cat > skills/[category]/[skill-name].md << 'EOF'
---
name: "Skill Name"
description: "What it does"
version: "1.0"
category: "[category]"
dependencies: ["skill-1", "skill-2"]
---

# [Skill Name]

## Purpose
[Why this skill exists]

## How to Use
[Usage instructions]

## Examples
[Real examples]

## Success Criteria
[How to know it worked]
EOF
```

### 4. Add to Registry

Edit `skills/registry.json`:

```json
{
  "id": "skill-name",
  "name": "Skill Name",
  "description": "What it does",
  "enabled": true,
  "priority": [next number],
  "dependencies": ["skill-1", "skill-2"]
}
```

### 5. Test

```bash
# Run agent task using new skill
# Verify it works
# Check CLAUDE.md for learnings
# Review tracking/usage-stats.json
```

### 6. Commit

```bash
git add skills/[category]/[skill-name].md skills/registry.json
git commit -m "Feature: Add [skill-name] for [purpose]"
git push
```

### 7. Document

Update relevant docs:
- `AGENTS.md` if it affects agents
- `LEARNING-SYSTEM.md` if it's learning-related
- `WHATS-NEW.md` to announce it

---

## Workflow: Optimizing a Workflow

### 1. Notice Issue

```
"Workflow X is taking too long" or "Success rate is low"
```

### 2. Analyze

```bash
# Check workflow stats
cat tracking/workflow-stats.json | grep "workflow-name"

# Look at recent executions
# Identify patterns
```

### 3. Try Improvement

```bash
# Test optimization
# Track results
# Compare before/after
```

### 4. Document Learning

```bash
# Add to CLAUDE.md
code memory/CLAUDE.md

# Add improvement details
# Commit
git add memory/CLAUDE.md
git commit -m "Learning: [workflow-name] optimization - [improvement]"
```

### 5. Update Workflow

```bash
# Update workflow file if needed
code workflows/[workflow-name].md

# Commit
git add workflows/[workflow-name].md
git commit -m "Optimization: [workflow-name] performance improved"
```

---

## Code Review Checklist

Before submitting changes:

- [ ] Code/docs are clear and well-commented
- [ ] No sensitive data (API keys, passwords)
- [ ] Follows naming conventions
- [ ] Files properly formatted
- [ ] Commit message is clear
- [ ] No unnecessary files included
- [ ] Related docs updated
- [ ] Tested (if code)

---

## Getting Help

### Questions?
Check documentation files first:
- [SYSTEM-COMPLETE.md](SYSTEM-COMPLETE.md)
- [LEARNING-SYSTEM.md](LEARNING-SYSTEM.md)
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md)

### Issues?
Check `memory/CLAUDE.md` for similar issues

### Need Feedback?
Create an issue or discussion in your repository

---

## Appreciation

Your contributions make this system:
- ✅ More capable
- ✅ More useful
- ✅ Continuously improving
- ✅ Better at what you need

**Thank you for contributing!** 🙏

---

## License & Attribution

All contributions become part of the Ramp-Agent system.

**Contributions are:**
- Appreciated
- Credited
- Helpful to others
- Part of continuous learning

---

**Ready to contribute?** Pick an area above and get started! 🚀
