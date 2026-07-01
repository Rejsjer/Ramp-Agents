---
name: "SaaS Project Management Connector"
description: "Connects and automates workflows across project management tools (Jira, Asana, Linear, Monday)"
version: "1.0"
author: "Ramp-Agent"
created: "2026-07-01"
status: "active"
type: "specialized"

applyTo:
  - projects: ["any"]
  - domains: ["automation", "project-management", "task-tracking"]

capabilities:
  - project-sync
  - task-management
  - sprint-automation
  - status-tracking
  - team-coordination

skills:
  - agent-reach
  - task-observer
  - stop-slop

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

## Supported Project Management Platforms

- **Jira** - Enterprise agile with deep customization
- **Asana** - General project management, portfolio view
- **Linear** - Developer-focused, fast and intuitive
- **Monday.com** - Visual, flexible work OS
- **ClickUp** - All-in-one productivity platform

## When to Use This Skill

- Create tasks from GitHub issues
- Sync sprint status across teams
- Update task status automatically
- Generate sprint reports
- Create recurring tasks
- Assign work to team members
- Track blockers and dependencies
- Sync with engineering workflows

## Supported Operations

### Task Management
```
Create Task
- Fields: title, description, assignee, due_date, project, priority
- Return: task_id, url

Update Task
- Fields: status, assignee, due_date, priority, custom_fields
- Return: success, updated_fields

Get Task
- Query: by ID, by assignee, by project, by status
- Return: full task record

Delete Task
- Archive available in most platforms
- Return: success, archive_confirmation
```

### Sprint/Project Management
```
Create Sprint
- Fields: name, start_date, end_date, goal
- Return: sprint_id, url

Get Sprint Status
- Return: tasks by status, burndown, velocity
- Metrics: completed, in_progress, blocked

Move Task to Sprint
- From sprint, To sprint
- Return: success, sprint_assignment
```

### Team & Notifications
```
Assign Task
- To: team member
- Return: success, assignment_timestamp

Add Comment
- On task with: message, @mentions
- Return: comment_id, url

Set Reminder
- For: task, when: before_due_date or custom_time
- Return: reminder_id
```

## Authentication

```yaml
Jira:
  type: "API Token"
  credentials: ["domain", "email", "api_token"]
  
Asana:
  type: "OAuth 2.0 / Personal Token"
  credentials: ["personal_access_token"]
  
Linear:
  type: "API Key"
  credentials: ["api_key"]
  
Monday:
  type: "API Token"
  credentials: ["api_token"]
```

## Common Workflows

### GitHub Issue → Project Task
```
1. Receive GitHub webhook (new issue)
2. Create task in project management tool
3. Add GitHub issue link in task description
4. Assign based on label mapping
5. Add to current sprint
6. Notify team in Slack
```

### Sprint Status Update
```
1. Get all tasks in sprint
2. Count: completed, in_progress, blocked
3. Calculate: velocity, burndown
4. Generate summary
5. Update status page
6. Email report to stakeholders
```

### Daily Standup Prep
```
1. Get previous day's completed tasks
2. Get in_progress tasks
3. Get blocked tasks
4. Identify blockers
5. Prepare standup notes
6. Post to team channel
```

### Recurring Task Creation
```
1. Define: task template, frequency, assignee
2. Schedule: weekly, bi-weekly, monthly
3. Auto-create at schedule time
4. Link to epic/project
5. Notify assignee
6. Log in automation history
```

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| User not found | Assignee not in workspace | Suggest available users |
| Project not found | Project archived or deleted | List available projects |
| Custom field invalid | Field doesn't exist or wrong type | Use default fields |
| Rate limit | Too many API calls | Queue for later, retry |
| Duplicate task | Task already exists | Return existing task ID |

## Performance Considerations

- Batch operations for bulk task creation
- Use webhooks for real-time sync instead of polling
- Cache project/user data locally
- Implement exponential backoff for retries
- Monitor API rate limits

## Integration Patterns

### Pattern 1: Single Source of Truth
- One tool is authoritative (e.g., Linear)
- Other tools synced from primary
- Conflicts resolved toward primary

### Pattern 2: Distributed Workflow
- Engineering tasks in Linear
- Product tasks in Asana
- Cross-tool sync at boundaries

### Pattern 3: Aggregation
- Multiple tools consolidated
- Single view of all work
- Master status derived from components

## Notes

- Each platform has different terminology (issues vs tasks vs work items)
- Field names and custom fields vary significantly
- Sync conflicts require careful handling
- Updates CLAUDE.md with integration patterns
- Logs all automation for audit trail and debugging
