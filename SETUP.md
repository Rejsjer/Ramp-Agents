# Ramp-Agent: Setup Guide

**Installation Time:** 10-15 minutes  
**Difficulty:** Easy  
**Requirements:** Node.js 14+, Git  

---

## Quick Setup (5 minutes)

### Step 1: Clone & Install

```bash
# Clone the repository
git clone <repo-url> Ramp-Agent
cd Ramp-Agent

# Install dependencies (if any)
npm install
```

### Step 2: Initialize Your Profile

```bash
# Edit your user profile
nano memory/user.profile.md
# or
code memory/user.profile.md
```

Fill out:
- Your name and role
- Communication preferences
- Top 3 priorities
- Save and close

### Step 3: Create Your First Project

```bash
# Copy project template
cp memory/projects/PROJECT-TEMPLATE.md memory/projects/my-project.md

# Edit your project
code memory/projects/my-project.md
```

Fill out:
- Why the project exists
- Success criteria
- Tech stack
- Save and close

### Step 4: Verify Installation

```bash
# Check if core directories exist
ls -la memory/
ls -la hooks/
ls -la skills/
ls -la vscode-integration/

# Check if key files exist
test -f memory/CLAUDE.md && echo "✓ CLAUDE.md exists"
test -f memory/user.profile.md && echo "✓ User profile exists"
test -f skills/registry.json && echo "✓ Skills registry exists"
```

**You're ready!** 🎉

---

## Complete Setup Guide

### Prerequisites

```bash
# Check Node.js version
node --version
# Required: v14.0.0 or higher

# Check Git is installed
git --version
```

### Installation Steps

#### 1. Clone Repository

```bash
git clone https://github.com/your-org/ramp-agent.git
cd Ramp-Agent
```

#### 2. Install Dependencies

```bash
# If package.json exists
npm install

# If using yarn
yarn install
```

#### 3. Set Up Environment

```bash
# Copy environment template (if it exists)
cp .env.example .env

# Edit with your settings
nano .env
```

Typical `.env` variables:
```
RAMP_AGENT_ENABLED=true
RAMP_AGENT_USER_PROFILE_PATH=memory/user.profile.md
RAMP_AGENT_CONTEXT_INJECTION=true
RAMP_AGENT_LOG_LEVEL=info
```

#### 4. Initialize Git Configuration

```bash
# Configure git to use proper line endings
git config core.autocrlf true

# Set your git user (if not already set)
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

#### 5. Create Local Directories

```bash
# Directories should already exist, but verify:
mkdir -p memory/projects
mkdir -p memory/workflows
mkdir -p hooks/context-injection
mkdir -p vscode-integration
mkdir -p tracking
mkdir -p config
mkdir -p skills/engineering
mkdir -p skills/automation
mkdir -p skills/marketing
mkdir -p skills/enterprise-personas
```

#### 6. Initialize Your Profile

Edit `memory/user.profile.md`:

```bash
code memory/user.profile.md
# or
nano memory/user.profile.md
```

Required sections to fill:
- Name and role
- Focus areas
- Communication style
- Priorities
- What works/doesn't work

#### 7. Create Project Memory

```bash
# For each project you're working on:
cp memory/projects/PROJECT-TEMPLATE.md memory/projects/[project-name].md

# Edit each one
code memory/projects/[project-name].md
```

Fill out:
- Project overview
- Success criteria
- Technical context
- Current status
- Team info

#### 8. Verify Setup

```bash
# Run setup verification script
node scripts/validate-ramp-agent.js

# Or manually check:
echo "Checking directories..."
test -d memory && echo "✓ memory/" || echo "✗ memory/ missing"
test -d hooks && echo "✓ hooks/" || echo "✗ hooks/ missing"
test -d tracking && echo "✓ tracking/" || echo "✗ tracking/ missing"

echo "Checking files..."
test -f memory/user.profile.md && echo "✓ user.profile.md" || echo "✗ user.profile.md missing"
test -f memory/CLAUDE.md && echo "✓ CLAUDE.md" || echo "✗ CLAUDE.md missing"
test -f skills/registry.json && echo "✓ skills/registry.json" || echo "✗ skills/registry.json missing"
```

---

## First-Time Usage

### Start Your First Session

```bash
# Navigate to workspace
cd Ramp-Agent

# Open in VS Code
code .

# Or your preferred editor
```

### Test Agent Integration

```bash
# If using Claude integration
# Try running a simple task with your project

# Example (in agent workspace):
# "Build X for my-project"
```

### Monitor Initial Learning

```bash
# Check if system is tracking
cat tracking/usage-stats.json

# See if learnings are being logged
cat memory/CLAUDE.md
```

---

## Git Workflow

### Initial Commit

```bash
# Stage all files
git add .

# Commit with message
git commit -m "Initial Ramp-Agent setup with 25 skills and learning system"

# Push to remote
git push origin main
```

### Regular Commits

```bash
# After making changes to profiles/projects:
git add memory/
git commit -m "Update project context and learnings"
git push

# After workflow improvements:
git add memory/CLAUDE.md tracking/
git commit -m "Log workflow learnings and improvements"
git push
```

### What to Commit

✅ **Always commit:**
- `memory/user.profile.md` - Your preferences
- `memory/projects/*.md` - Project contexts
- `memory/CLAUDE.md` - Learnings
- `README.md`, documentation files
- `skills/registry.json` - Skill registry
- Configuration files

❌ **Don't commit:**
- `tracking/usage-stats.json` - Auto-generated metrics
- `tracking/workflow-stats.json` - Auto-generated stats
- `sessions/session-*.md` - Active sessions (keep `session-template.md`)
- `.env` - Environment variables
- `node_modules/` - Dependencies
- `.vscode/` - Local IDE settings

---

## Directory Structure Verification

After setup, you should have:

```
Ramp-Agent/
├── .gitignore                 # ✓ Git ignore rules
├── .git/                      # ✓ Git repository
├── package.json               # ✓ Node dependencies
├── README.md                  # ✓ Project overview
├── SETUP.md                   # ✓ This file
├── QUICK-REFERENCE.md         # ✓ Cheat sheet
├── SYSTEM-COMPLETE.md         # ✓ System overview
├── LEARNING-SYSTEM.md         # ✓ Learning architecture
├── VSCODE-INTEGRATION.md      # ✓ VS Code guide
├── ARCHITECTURE-DIAGRAMS.md   # ✓ Visual diagrams
├── WHATS-NEW.md              # ✓ What was added
├── memory/
│   ├── user.profile.md        # ✓ Your preferences (CUSTOMIZE)
│   ├── CLAUDE.md              # ✓ Central learnings
│   ├── projects/
│   │   ├── PROJECT-TEMPLATE.md # ✓ Template
│   │   └── my-project.md       # ✓ Your projects (CREATE)
│   └── workflows/             # ✓ Directory
├── hooks/
│   ├── context-injection/     # ✓ Learning infrastructure
│   │   ├── sub-agent-context-injector.js
│   │   ├── workflow-learning-system.js
│   │   └── smart-context-router.js
│   ├── pre-tool-use.js        # ✓ Permission hook
│   └── post-tool-use.js       # ✓ Formatting hook
├── vscode-integration/
│   └── agent-api.js           # ✓ VS Code integration
├── skills/
│   ├── registry.json          # ✓ 25 skills
│   ├── engineering/           # ✓ 4 skills
│   ├── automation/            # ✓ 3 connectors
│   ├── marketing/             # ✓ 1 persona
│   └── enterprise-personas/   # ✓ 4 personas
├── config/
│   ├── claude-settings.json   # ✓ System config
│   └── permissions.json       # ✓ Permissions
├── tracking/
│   ├── usage-stats.json       # ✓ Auto-generated
│   └── workflow-stats.json    # ✓ Auto-generated
└── sessions/
    └── session-template.md    # ✓ Template
```

---

## Troubleshooting Setup

### Issue: "Module not found"

```bash
# Solution: Install dependencies
npm install

# Or reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: User profile not loading

```bash
# Verify file exists
test -f memory/user.profile.md && echo "File exists" || echo "File missing"

# Check permissions
ls -la memory/user.profile.md

# Verify format is YAML
head -5 memory/user.profile.md
```

### Issue: Git not tracking files

```bash
# Check gitignore isn't blocking files
git status

# Force add if needed
git add -f memory/user.profile.md

# Verify it's staged
git status
```

### Issue: Directories not created

```bash
# Create missing directories manually
mkdir -p memory/projects memory/workflows
mkdir -p hooks/context-injection
mkdir -p vscode-integration
mkdir -p tracking config
mkdir -p skills/{engineering,automation,marketing,enterprise-personas}

# Verify
ls -la memory/
ls -la hooks/context-injection/
```

---

## Next Steps After Setup

### Week 1
- [ ] Git repository initialized
- [ ] User profile filled out
- [ ] First project created
- [ ] First agent task run
- [ ] Setup verified working

### Week 2-4
- [ ] All projects created
- [ ] Regular commits of learnings
- [ ] Workflows being tracked
- [ ] Optimization suggestions reviewed

### Month 2+
- [ ] System continuously improving
- [ ] Regular commits of learnings
- [ ] Metrics tracked
- [ ] VS Code integration ready

---

## Quick Commands Reference

```bash
# Setup
npm install                    # Install dependencies
git init                       # Initialize repo
git add .                      # Stage all files
git commit -m "Initial setup"  # First commit

# Daily usage
code .                         # Open in VS Code
git status                     # Check changes
git add .                      # Stage changes
git commit -m "Update learnings"  # Commit

# Verification
npm run validate              # Validate via package script
node scripts/validate-ramp-agent.js # Validate skills and integration
ls -la memory/                 # Check memory files
cat memory/CLAUDE.md           # View learnings
cat tracking/usage-stats.json  # View metrics

# Cleanup
rm -rf node_modules            # Remove dependencies
rm .env                        # Remove env file
rm -f tracking/*.json          # Reset metrics
```

---

## Support

### Documentation
- [QUICK-REFERENCE.md](QUICK-REFERENCE.md) - Cheat sheet
- [SYSTEM-COMPLETE.md](SYSTEM-COMPLETE.md) - Full overview
- [LEARNING-SYSTEM.md](LEARNING-SYSTEM.md) - How learning works
- [VSCODE-INTEGRATION.md](VSCODE-INTEGRATION.md) - VS Code setup

### Common Issues
See Troubleshooting section above

### Getting Help
Check the documentation first, then review CLAUDE.md for similar issues

---

## Success Checklist

After setup, you should have:

- ✅ Git repository initialized
- ✅ All directories created
- ✅ User profile filled out
- ✅ First project created
- ✅ 25 skills registered
- ✅ `node scripts/validate-ramp-agent.js` passes
- ✅ Central CLAUDE.md ready
- ✅ Hooks in place
- ✅ VS Code integration ready
- ✅ Tracking system ready
- ✅ First commit made

**You're ready to start using Ramp-Agent!** 🚀

---

**Questions?** Refer to [QUICK-REFERENCE.md](QUICK-REFERENCE.md) or [SYSTEM-COMPLETE.md](SYSTEM-COMPLETE.md)
