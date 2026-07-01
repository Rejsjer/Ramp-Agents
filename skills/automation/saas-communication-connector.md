---
name: "SaaS Communication Connector"
description: "Connects and automates workflows across communication platforms (Slack, Discord, Teams)"
version: "1.0"
author: "Ramp-Agent"
created: "2026-07-01"
status: "active"
type: "specialized"

applyTo:
  - projects: ["any"]
  - domains: ["automation", "team-communication", "notifications"]

capabilities:
  - message-routing
  - channel-management
  - notification-delivery
  - thread-automation
  - mention-handling

skills:
  - agent-reach
  - task-observer
  - markitdown

hooks:
  preToolUse: true
  postToolUse: true
  agentStop: true
  feedbackLoop: true

permissions:
  autoApproval: true
  approvalThreshold: 0.35
  maxConcurrentTasks: 5
---

## Supported Communication Platforms

- **Slack** - Team messaging, integrations hub
- **Discord** - Community-focused, free/paid
- **Microsoft Teams** - Enterprise integration with Office 365
- **Telegram** - Mobile-first, bot friendly
- **Matrix/Element** - Open protocol alternative

## When to Use This Skill

- Send notifications from automation
- Route alerts to right channels
- Create threads for discussions
- Post daily summaries or reports
- Notify teams of status changes
- Handle mentions and @-replies
- Manage channel memberships
- Archive or search conversations

## Supported Operations

### Message Management
```
Send Message
- To: channel or direct message
- Content: text, formatted, with attachments
- Return: message_id, timestamp

Post Thread Reply
- To: existing message
- Reply: formatted text
- Return: thread_id, reply_timestamp

Edit Message
- Message ID, new content
- Return: success, edit_timestamp

Delete Message
- Message ID
- Return: success (soft delete available)
```

### Channel Management
```
Create Channel
- Name, description, visibility
- Return: channel_id, url

Add Members
- To channel: user list or team
- Return: success, member_count

Set Topic
- For channel: status/announcement
- Return: success, timestamp

Archive Channel
- Mark as archived
- Return: success, archive_date
```

### Notifications & Alerts
```
Send Alert
- Level: info, warning, error, critical
- Target: channel or user
- Include: context, action links
- Return: message_id

Handle Mention
- When @user mentioned, respond with...
- Logic: check context, take action
- Return: response_id
```

## Authentication

```yaml
Slack:
  type: "OAuth 2.0"
  credentials: ["bot_token", "signing_secret"]
  scopes: ["chat:write", "channels:read", "users:read"]
  
Discord:
  type: "Bot Token"
  credentials: ["bot_token"]
  
Teams:
  type: "Incoming Webhook / OAuth"
  credentials: ["webhook_url"] or ["app_id", "app_password"]
  
Telegram:
  type: "Bot Token"
  credentials: ["bot_token", "chat_id"]
```

## Common Workflows

### Alert Routing
```
1. Receive alert (error, deployment, metric)
2. Determine severity (critical, high, medium, low)
3. Route to appropriate channel:
   - Critical → #critical-alerts @on-call
   - High → #engineering-alerts
   - Medium → #general + thread
   - Low → #status-page
4. Include context (error details, metrics, links)
5. Add action buttons (view logs, acknowledge, resolve)
```

### Daily Standup Summary
```
1. Collect previous day's work (from project tools)
2. Summarize by team member
3. Identify blockers
4. Post in #standup thread
5. Request updates from team
6. Compile into report
7. Email to managers
```

### Status Page Updates
```
1. Monitor system health
2. When status changes (up → degraded → down)
3. Post to #status channel
4. Update topic
5. Create escalation thread
6. Notify subscribers
7. Update external status page
```

### Deployment Notifications
```
1. Deployment starts
   → Post "Deployment in progress"
   → Link to deployment dashboard
   
2. Deployment progresses
   → Update thread with milestones
   → Post logs snippet
   
3. Deployment completes/fails
   → Post result
   → Link to metrics/logs
   → Tag release manager
   → Request approval
```

## Message Formatting

### Slack Message Template
```json
{
  "channel": "#engineering",
  "text": "Deployment completed",
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "🚀 Deployment: Production"
      }
    },
    {
      "type": "section",
      "text": {
        "type": "mrkdwn",
        "text": "*Status:* ✅ Success\n*Duration:* 5m 23s\n*Version:* v2.1.0"
      }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": {"type": "plain_text", "text": "View Logs"},
          "url": "https://logs.example.com/deployment-123"
        }
      ]
    }
  ]
}
```

### Discord Embed Template
```json
{
  "embeds": [{
    "title": "Deployment: Production",
    "description": "🚀 Deployment completed successfully",
    "color": 65280,
    "fields": [
      {"name": "Status", "value": "✅ Success", "inline": true},
      {"name": "Duration", "value": "5m 23s", "inline": true},
      {"name": "Version", "value": "v2.1.0", "inline": true}
    ]
  }]
}
```

## Rate Limiting & Throttling

| Platform | Limit | Strategy |
|----------|-------|----------|
| Slack | 1 msg/second per channel | Queue messages, batch |
| Discord | 10 msg/10 sec per channel | Spread over time |
| Teams | 5 msg/second | Use thread replies |
| Telegram | 30 msg/second | Batch API calls |

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| Channel not found | Channel deleted or wrong name | List channels, use default |
| User not found | User removed or ID wrong | Check active members |
| Rate limited | Too many messages | Queue and retry with backoff |
| Permission denied | Bot lacks scopes | Update bot permissions |
| Message too long | Exceeds platform limit | Truncate or split into threads |

## Threading & Conversations

- Group related messages in threads
- Keep main channel clean
- Use threads for discussions
- Archive completed threads
- Link back to original context

## Notes

- Each platform has different formatting (Markdown vs HTML vs custom)
- Rate limits vary significantly
- Some platforms better for notifications, others for conversations
- Updates CLAUDE.md with notification patterns and issues
- Logs delivery success/failures for audit trail
