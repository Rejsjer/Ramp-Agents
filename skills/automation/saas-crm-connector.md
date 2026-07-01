---
name: "SaaS CRM Connector"
description: "Connects and automates workflows across CRM platforms (Salesforce, HubSpot, Pipedrive)"
version: "1.0"
author: "Ramp-Agent"
created: "2026-07-01"
status: "active"
type: "specialized"

applyTo:
  - projects: ["any"]
  - domains: ["automation", "crm-integration", "sales"]

capabilities:
  - crm-sync
  - contact-management
  - opportunity-tracking
  - workflow-automation
  - data-enrichment

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

## Supported CRM Platforms

- **Salesforce** - Enterprise CRM with advanced customization
- **HubSpot** - Mid-market friendly, integrated marketing/sales
- **Pipedrive** - Sales-focused, visual pipeline management
- **Close** - Sales automation focused
- **Zoho CRM** - Affordable alternative with automation

## When to Use This Skill

- Sync contacts between systems
- Automate deal pipeline management
- Create leads from inbound channels
- Update opportunity stages
- Enrich contact data
- Generate sales reports
- Trigger notifications on CRM events
- Batch import/export customer data

## Supported Operations

### Contact Management
```
Create Contact
- Fields: name, email, phone, company, title
- Return: contact_id, record_url

Update Contact
- Fields: any contact property
- Return: success, updated_fields

Get Contact
- Query: by email, phone, company, tag
- Return: full contact record

Delete Contact
- Soft delete available
- Return: success, archive_url
```

### Opportunity Tracking
```
Create Opportunity
- Fields: name, amount, stage, owner, probability
- Return: opportunity_id, record_url

Update Stage
- From: current_stage, To: new_stage
- Return: success, history

Get Pipeline
- View: all opportunities, by owner, by stage
- Return: pipeline_summary with metrics
```

### Workflow Automation
```
Trigger Workflow
- On: event (new contact, stage change, etc.)
- Action: send email, create task, update field
- Return: execution_id, status

Get Automation Status
- Monitor active workflows
- Return: execution details, logs
```

## Authentication

```yaml
Salesforce:
  type: "OAuth 2.0"
  credentials: ["client_id", "client_secret", "refresh_token"]
  
HubSpot:
  type: "API Key"
  credentials: ["api_key"]
  
Pipedrive:
  type: "API Token"
  credentials: ["company_domain", "api_token"]
```

## Common Workflows

### Lead to Contact Sync
```
1. Receive new lead from web form
2. Check if contact exists in CRM
3. If not: Create contact, assign to team
4. If yes: Update contact record
5. Create task for follow-up
6. Log in automation history
```

### Pipeline Report Generation
```
1. Get all opportunities
2. Group by stage
3. Calculate metrics: total value, count, velocity
4. Format as report
5. Email to sales team
6. Update dashboard
```

### Contact Enrichment
```
1. Get contact record
2. Look up external data sources
3. Update: job title, company info, industry
4. Add tags/scoring
5. Update contact in CRM
6. Trigger sales workflow
```

## Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| Duplicate contact | Email already exists | Return existing contact ID |
| Invalid field | Field doesn't exist in this CRM | Log error, skip field |
| Rate limit exceeded | Too many API calls | Back off exponentially |
| Auth token expired | Credentials need refresh | Refresh token, retry |
| Missing required field | Contact missing critical data | Fail with clear message |

## Performance Considerations

- Batch operations for bulk imports
- Cache contact lookups
- Use webhooks instead of polling
- Implement retry logic with backoff
- Monitor API rate limits

## Notes

- Each CRM has different field names and structures
- Data mapping required for multi-CRM workflows
- Updates CLAUDE.md with integration patterns and issues
- Logs all automation activity for audit trail
