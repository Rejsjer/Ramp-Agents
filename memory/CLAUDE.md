# CLAUDE.md - Central Learning & Memory Log

**Last Updated:** 2026-07-01  
**Session Count:** 0  
**Active Sessions:** 0/4  
**Total Agent Usage:** 0%  

---

## Core Learnings

### Architecture Decisions
- Multi-agent orchestration with shared memory system
- User-managed parallel sessions (max 4 concurrent)
- Unlimited sub-agent spawning for Claude internal orchestration
- Usage-triggered compaction at 35% threshold
- CLAUDE.md as single source of truth

### Workflow Patterns
*To be populated as workflows are established*

### Known Issues & Resolutions
- 2026-07-01: `skills/registry.json` was malformed after generated content was spliced into the middle of the JSON. Rebuilt it as a valid 25-skill catalog and verified `vscode-integration/agent-api.discoverSkills()` returns 25 skills.
- 2026-07-01: `vscode-integration/agent-api.js` used `../../` paths from the integration folder, which resolved outside the Ramp-Agent workspace. Added `ROOT_DIR` and corrected file reads/writes to use workspace-local paths.
- 2026-07-01: Advisor persona frontmatter referenced placeholder skills that were not registered. Aligned persona `skills:` lists to registered skill IDs and added `scripts/validate-ramp-agent.js` plus `npm run validate` to catch registry, dependency, file, and VS Code discovery drift.

### Performance Notes
- Track parallel session efficiency
- Monitor memory compaction triggers
- Document optimization opportunities

### Integration Status
- Skills registered: 25 (14 core, 4 engineering, 3 automation, 4 personas)
- Hooks configured: PostToolUse (code formatting)
- Agents initialized: 0
- Workflows codified: 0

---

## Session Log

### Session 1
- **Status:** Not Started
- **Agent Assignment:** TBD
- **Git Checkout:** TBD
- **Output:** TBD

### Session 2
- **Status:** Not Started
- **Agent Assignment:** TBD
- **Git Checkout:** TBD
- **Output:** TBD

### Session 3
- **Status:** Not Started
- **Agent Assignment:** TBD
- **Git Checkout:** TBD
- **Output:** TBD

### Session 4
- **Status:** Not Started
- **Agent Assignment:** TBD
- **Git Checkout:** TBD
- **Output:** TBD

---

## Memory Compaction History

*Compaction triggered when combined agent usage exceeds 35%*

| Date | Trigger Agent | Usage % | Action | Result |
|------|---------------|---------|--------|--------|
| TBD  | TBD           | TBD     | TBD    | TBD    |

---

## Agent Self-Feedback Log

*Internal feedback mechanisms for continuous improvement*

- **Iteration 1:** [To be populated]
- **Iteration 2:** [To be populated]

