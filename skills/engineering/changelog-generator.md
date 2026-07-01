---
name: "Changelog Generator"
description: "Generates structured changelogs from commit history using conventional commits"
version: "1.0"
author: "Ramp-Agent"
created: "2026-07-01"
status: "active"
type: "specialized"

applyTo:
  - projects: ["any"]
  - domains: ["release-management", "documentation", "version-control"]

capabilities:
  - changelog-generation
  - commit-parsing
  - version-categorization
  - release-notes-formatting
  - semantic-versioning

skills:
  - task-observer
  - markitdown
  - impeccable

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

- Generate CHANGELOG.md from git commits
- Create release notes for a new version
- Document breaking changes
- Track feature additions and bug fixes
- Prepare for semantic versioning bumps
- Create historical version documentation
- Automate changelog in CI/CD pipeline

## How It Works

### Conventional Commits Format

The skill parses commits following this structure:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Code style (no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Test changes
- `chore:` - Build, dependencies, tooling
- `ci:` - CI/CD changes
- `BREAKING CHANGE:` - Breaking change (triggers major version)

**Example:**
```
feat(api): add user authentication endpoint

Implements OAuth 2.0 based authentication with JWT tokens.

BREAKING CHANGE: removed /api/v1/login endpoint
Migrated to /api/v2/auth/login
```

### Changelog Structure

```markdown
# Changelog

## [2.1.0] - 2026-07-01

### Added
- User authentication via OAuth 2.0 (#456)
- New dashboard widget for metrics (#453)

### Fixed
- Memory leak in session handler (#450)
- Typo in documentation (#448)

### Changed
- Updated dependencies to latest versions
- Improved error messages for debugging

### Removed
- Deprecated /api/v1/login endpoint

### Security
- Added rate limiting to API endpoints

## [2.0.0] - 2026-06-15

### Breaking Changes
- Removed support for Node.js 14
- Changed API response format for events

### Added
- Multi-language support
- WebSocket real-time updates

...
```

## Instructions

### Phase 1: Configuration

1. **Define Changelog Format**
   - File location (CHANGELOG.md)
   - Style (Keep a Changelog, Semantic Versioning, custom)
   - Include/exclude sections (security, performance, etc.)
   - Contributor attribution (yes/no)

2. **Set Version Scheme**
   - Semantic versioning (major.minor.patch)
   - Calver (calendar-based)
   - Custom scheme
   - Starting version

3. **Configure Commit Parsing**
   - Conventional commits vs custom format
   - Commit type mappings
   - Scope handling
   - Co-authors/reviewers tracking

### Phase 2: Changelog Generation

1. **Gather Commits**
   - Tag range (v1.0.0..v2.0.0)
   - Branch (main only, all branches)
   - Date range (since timestamp)
   - Filter criteria (author, scope, type)

2. **Parse Commits**
   - Extract type, scope, subject
   - Parse body for details
   - Identify breaking changes
   - Group by category

3. **Determine Version Number**
   - Count breaking changes (major)
   - Count features (minor)
   - Count fixes (patch)
   - Calculate next version

4. **Generate Changelog Entry**
   - Format each commit
   - Group by type
   - Add date and version
   - Include related issue/PR links

5. **Update Changelog File**
   - Prepend new version
   - Preserve existing versions
   - Maintain formatting consistency

### Phase 3: Enhancement

1. **Add Metadata**
   - Release date
   - Contributors
   - Comparison URL (GitHub, GitLab)
   - Issue/PR cross-references

2. **Include Release Notes**
   - Highlights/summary
   - Migration guide for breaking changes
   - Known issues
   - Installation instructions

3. **Generate Release Artifacts**
   - CHANGELOG.md
   - RELEASE_NOTES.md
   - GitHub Release text
   - Release announcement template

## Commit Examples

### Simple Feature
```
feat(api): add health check endpoint

Returns API status and version information.
```

### Bug Fix
```
fix(database): handle null connection pool

Prevents crash when database connection fails.

Fixes #1234
```

### Breaking Change
```
feat(api)!: redesign response format

Changes response structure from object to array format.

BREAKING CHANGE: All endpoints now return arrays instead of objects.
Migration guide: See docs/migration-v2.md

Fixes #2345
```

### Documentation
```
docs: update API authentication guide

Adds examples for JWT token handling.
```

## Changelog Entry Mapping

| Commit Type | Changelog Section | Priority |
|------------|------------------|----------|
| `feat` | Added | High |
| `fix` | Fixed | High |
| `perf` | Changed | Medium |
| `refactor` | Changed | Low |
| `BREAKING CHANGE` | Breaking Changes | Critical |
| `security` | Security | High |
| `docs` | Documentation | Low |
| `test` | Tests | Low |
| `chore` | Dependencies | Low |

## CLI Examples

```bash
# Generate changelog for next version
ramp-agent changelog generate --next-version

# Generate changelog from last tag to HEAD
ramp-agent changelog generate --last-tag

# Generate for date range
ramp-agent changelog generate --since "2026-06-01" --until "2026-07-01"

# Include only specific types
ramp-agent changelog generate --types feat,fix,perf

# Generate release notes
ramp-agent changelog release-notes --version 2.1.0

# Validate conventional commits
ramp-agent changelog validate --check-commits
```

## Automation in CI/CD

```yaml
# .github/workflows/changelog.yml
name: Generate Changelog
on:
  push:
    tags:
      - 'v*'

jobs:
  changelog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - name: Generate Changelog
        run: ramp-agent changelog generate --version ${{ github.ref_name }}
      - name: Create Release
        uses: actions/create-release@v1
        with:
          tag_name: ${{ github.ref_name }}
          body: ${{ github.changelog }}
```

## Template: Release Notes

```markdown
# Release v2.1.0

**Release Date:** July 1, 2026

## What's New

🎉 Major features in this release:
- OAuth 2.0 authentication (#456)
- New dashboard metrics (#453)
- Performance improvements (+40% speed)

## Bug Fixes

🐛 Fixed in this release:
- Memory leak in session handler (#450)
- Incorrect error messages (#448)

## Migration Guide

⚠️ **Breaking Changes:**
- Removed deprecated `/api/v1/login` endpoint
- Use `/api/v2/auth/login` instead

See [Migration Guide](docs/migration-v2.md) for details.

## Contributors

Thanks to @alice, @bob, and @charlie for contributions!

## Download

- [Source Code](https://github.com/...)
- [Release Notes](CHANGELOG.md)
```

## Implementation Checklist

- [ ] Commit history uses conventional commits
- [ ] Version numbering scheme defined
- [ ] Changelog configuration created
- [ ] First changelog generated
- [ ] Format verified and reviewed
- [ ] Changelog committed to repository
- [ ] CI/CD automation configured
- [ ] Release process documented
- [ ] Team trained on commit conventions
- [ ] Results logged to CLAUDE.md

## Validation

- [ ] All commits follow conventional format
- [ ] Version numbers are accurate
- [ ] Breaking changes clearly marked
- [ ] Cross-references (PR/issue links) work
- [ ] Changelog is properly formatted
- [ ] Release notes are informative
- [ ] No sensitive data in changelog

## Notes

- Requires clean commit history for best results
- Enforcing conventional commits improves quality
- Can be used to auto-generate API documentation
- Updates CLAUDE.md with release methodology and outcomes
- Integrates with semantic versioning decisions
