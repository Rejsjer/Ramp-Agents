---
name: "Security Auditor"
description: "Scans skills, code, and configurations for security vulnerabilities and malicious patterns"
version: "1.0"
author: "Ramp-Agent"
created: "2026-07-01"
status: "active"
type: "specialized"

applyTo:
  - projects: ["any"]
  - domains: ["security", "code-review", "compliance"]

capabilities:
  - code-analysis
  - vulnerability-detection
  - malicious-code-scanning
  - configuration-audit
  - compliance-checking

skills:
  - impeccable
  - stop-slop
  - task-observer

hooks:
  preToolUse: true
  postToolUse: true
  agentStop: true
  feedbackLoop: true

permissions:
  autoApproval: true
  approvalThreshold: 0.35
  maxConcurrentTasks: 3
---

## When to Use This Skill

- Before installing new skills from untrusted sources
- Audit codebase for security vulnerabilities
- Scan configuration files for exposed secrets
- Verify compliance with security standards
- Check for dependency vulnerabilities
- Review agent permissions for over-privilege
- Detect malicious patterns in automation scripts

## How It Works

### Scan Types

**1. Skill Security Scan**
- SKILL.md format validation
- Dependency verification
- Permission over-privilege detection
- Malicious hook patterns
- Code injection vectors

**2. Code Security Audit**
- OWASP Top 10 check
- SQL injection patterns
- Command injection risks
- Cross-site scripting (XSS) vulnerabilities
- Path traversal attempts
- Insecure cryptography usage

**3. Configuration Audit**
- Exposed API keys/secrets
- Insecure default settings
- Over-permissive file modes
- Unencrypted sensitive data
- Hardcoded credentials
- Misconfigured access controls

**4. Dependency Analysis**
- Known CVE vulnerability check
- Supply chain attack detection
- Dependency version pinning
- License compliance

### Severity Levels

- **CRITICAL** - Immediate security breach risk
- **HIGH** - Significant vulnerability (fix within 24 hours)
- **MEDIUM** - Moderate risk (plan fix within sprint)
- **LOW** - Minor issue (can be deferred)
- **INFO** - Best practice recommendation

## Instructions

When conducting a security audit:

1. **Define Scope**
   - What components to audit (skills, code, config, dependencies)
   - What severity levels to report
   - What standards to enforce (OWASP, CWE, custom)

2. **Gather Artifacts**
   - Collect all files to audit
   - Identify critical entry points
   - Document trusted sources

3. **Execute Scans**
   - Run each scan type relevant to scope
   - Document each finding with evidence
   - Cross-reference with known CVEs
   - Check against custom rules

4. **Analyze Results**
   - Group findings by severity
   - Calculate overall risk score
   - Identify systemic issues
   - Trace root causes

5. **Generate Report**
   - Executive summary (risk level)
   - Finding details (what, where, severity, fix)
   - Remediation plan
   - Timeline recommendations
   - Metrics: total issues, by severity

6. **Update Memory**
   - Log security patterns discovered
   - Document remediation results
   - Update CLAUDE.md with findings
   - Track vulnerability trends

## Security Scanning Checklist

### Skill Files
- [ ] YAML frontmatter is valid
- [ ] Dependencies are verified
- [ ] Skills don't request excessive permissions
- [ ] No eval() or exec() in skill code
- [ ] No hardcoded secrets in skill
- [ ] Hook functions properly sandboxed

### Application Code
- [ ] SQL queries are parameterized
- [ ] No command injection vectors
- [ ] Input validation on all user input
- [ ] Output encoding for web contexts
- [ ] No sensitive data in logs
- [ ] Error messages don't leak info

### Configuration Files
- [ ] No API keys/tokens visible
- [ ] Permissions follow least privilege
- [ ] Encryption enabled for sensitive data
- [ ] Default credentials changed
- [ ] Access controls properly set

### Dependencies
- [ ] No known CVEs in versions
- [ ] Versions are pinned/locked
- [ ] Licenses reviewed for compliance
- [ ] Sources are trusted/verified

## Example Report

```
Security Audit Report
Date: 2026-07-01
Scope: Ramp-Agent skills, config, dependencies
Risk Level: MEDIUM (2 HIGH findings)

FINDINGS:
1. [CRITICAL] API key exposed in config/permissions.json:45
   - Severity: CRITICAL
   - Type: Exposed Secret
   - Fix: Move to environment variable
   - Timeline: Immediate

2. [HIGH] SQL query vulnerable to injection
   - File: workflows/database-query.js:23
   - Pattern: Unsanitized user input in query
   - Fix: Use parameterized queries
   - Timeline: Within 24 hours

3. [MEDIUM] Outdated dependency: lodash@4.17.15
   - CVE: CVE-2021-23337
   - Fix: Update to lodash@4.17.21
   - Timeline: Within sprint

SUMMARY:
- Total Issues: 3
- Critical: 1
- High: 1
- Medium: 1
- Risk Trend: Stable
- Recommendation: Address CRITICAL issue immediately
```

## Error Handling

| Scenario | Response |
|----------|----------|
| Permission denied on file | Mark as unauditable, note in report |
| Ambiguous finding | Flag as needs-review, escalate |
| Multiple scan failures | Increase verbosity, check logs |
| Config format error | Report malformed config location |
| Unknown file type | Skip with note, focus on known types |

## Notes

- Updates CLAUDE.md with security patterns discovered
- Integrates with compliance tracking systems
- Feeds findings to feedback loop
- Works in batch mode for full audits
- Can run continuously on critical systems
