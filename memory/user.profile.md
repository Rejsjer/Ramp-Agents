# User Profile & Intent

**Purpose:** Central record of who you are, what you care about, and why. Agents load this on startup to understand your context without re-explanation.

---

## Identity & Values

### About You
- **Name:** [Your name or how you want to be addressed]
- **Role:** [Your primary role/title]
- **Focus Areas:** [Top 3-5 areas you care most about]
- **Decision Making Style:** [How you prefer to make decisions - data-driven, intuitive, collaborative, etc.]

### What You Care About
- **Priority 1:** [e.g., "shipping quality code on time"]
- **Priority 2:** [e.g., "team collaboration and knowledge sharing"]
- **Priority 3:** [e.g., "sustainable growth without burnout"]

### Success Definition
- **For You:** [What does success look like?]
- **For Your Team:** [What does team success look like?]
- **For Your Projects:** [What defines project success?]

---

## Work Patterns & Preferences

### Communication Style
- **Preferred Format:** [verbose explanations, bullet points, code snippets, diagrams]
- **Speed vs Detail:** [Preference for quick answers vs thorough analysis]
- **Decision Input:** [How you like options presented]

### Workload Capacity
- **Current:** [e.g., "managing 3 concurrent projects"]
- **Desired:** [e.g., "managing 6 concurrent projects without stress"]
- **Constraint:** [e.g., "max 8 hours active work per day"]

### Learning Preferences
- **Learn By:** [hands-on, theory, examples, documentation]
- **Retention Strategy:** [note-taking, implementation, teaching others]
- **Knowledge Reuse:** [How you like to be reminded of past learnings]

---

## Projects & Interests

### Active Projects
- **Project A:** [Name] - [Your Role] - [Why it matters]
- **Project B:** [Name] - [Your Role] - [Why it matters]
- **Project C:** [Name] - [Your Role] - [Why it matters]

### Skills You Want to Develop
- [Skill 1]
- [Skill 2]
- [Skill 3]

### Areas to Avoid
- [What takes too much time without payoff]
- [What you dislike]
- [What someone else should handle]

---

## Agent Preferences

### How Agents Should Treat You
- **Autonomy Level:** [Full autonomy, suggest then execute, always ask first]
- **Escalation Trigger:** [When should agents ask for input?]
- **Communication Frequency:** [How often you want updates]

### Agent Instruction Patterns
- **Go/No-Go Questions:** [How agents should frame decisions]
- **Error Handling:** [How should errors be communicated?]
- **Success Metrics:** [How should agents measure success?]

### Skill Preferences
- **Prefer These Skills:** [Skills that work well for you]
- **Avoid These:** [Skills that don't fit]
- **Always Use:** [Skills that should be default]

---

## Learnings & Evolution

### Effective Patterns (What Works)
- **Pattern 1:** [Describe]
- **Pattern 2:** [Describe]
- **Pattern 3:** [Describe]

### Ineffective Patterns (What Doesn't Work)
- **Pattern 1:** [Describe]
- **Pattern 2:** [Describe]

### Experiments In Progress
- **Experiment A:** [Testing this approach]
- **Experiment B:** [Trying this workflow]

### Decisions Made
- **Decision:** [What you decided and why it matters]
- **Decision:** [What you decided and why it matters]

---

## Context Shortcuts

### Important Business Context
```
[Any important context that helps agents make decisions]
[e.g., "We're in growth phase, so speed matters more than perfection"]
```

### Technical Context
```
[Tech stack, architecture decisions, integration points]
[e.g., "We're migrating from X to Y, need backward compatibility"]
```

### Team Context
```
[How your team works, who does what, constraints]
[e.g., "Security team reviews all permissions changes, takes 2 days"]
```

### Key Constraints
```
[Regulatory, technical, organizational, time]
[e.g., "SOC 2 compliance required by Q4"]
```

---

## Agent Instructions

### When Starting Any Task
1. Load this profile
2. Match communication style to preferences above
3. Check active projects list
4. Reference past learnings
5. Ask clarifying questions if needed

### Context Injection Priority
1. **Critical:** User values and priorities
2. **High:** Active project context
3. **Medium:** Technical constraints
4. **Low:** Historical patterns

### If Unsure
- Default to user's stated preferences
- Escalate based on "escalation trigger"
- Update this profile with learnings

---

## Example Entries (Delete After Customizing)

### About You
- **Name:** Alex
- **Role:** Engineering Manager
- **Focus Areas:** Scaling team, improving code quality, shipping faster
- **Decision Making Style:** Data-driven with team input

### What You Care About
- **Priority 1:** Shipping quality code without team burnout
- **Priority 2:** Continuous learning and skill development
- **Priority 3:** Clear communication across distributed team

### Communication Style
- **Preferred Format:** Bullet points with specific examples
- **Speed vs Detail:** Quick summaries with deep-dive on request
- **Decision Input:** Options with pros/cons and recommendation

---

**Last Updated:** [Auto-filled by system]  
**Updated By:** [Auto-filled by system]  
**Agent Feedback:** [Agents log what they learn about you here]
