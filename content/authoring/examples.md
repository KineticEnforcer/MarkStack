---
title: Examples
description: Ready-to-use templates and examples for common MarkStack documentation patterns including category pages, documentation articles, and pages using multiple markdown features.
---

# Examples

This page provides templates for common documentation patterns. Use these as starting points when creating new content.

## Category Landing Pages

Category landing pages are `_index.md` files that introduce a documentation section. They set the category title, provide context, and help readers find the right content.

### Basic Category Landing

Create a file at `content/guides/_index.md` with this content:

**Frontmatter:**

```yaml
---
title: Guides
description: Step-by-step tutorials that walk you through common tasks from start to finish.
---
```

**Body content:**

```markdown
# Guides

This section contains practical tutorials for getting things done. Each guide takes you through a complete workflow with explanations at every step.

## Available Guides

- [Quick Start](/guides/quick-start/) is the best place for newcomers
- [Configuration](/guides/configuration/) covers all settings and options
- [Advanced Topics](/guides/advanced/) for experienced users

## How to Use These Guides

Work through guides in order if you are new, or jump to specific topics if you know what you need.
```

### Category Landing with Rich Content

For categories that need substantial introductory content (like an API reference), structure your `_index.md` with multiple sections:

**Frontmatter:**

```yaml
---
title: API Reference
description: Complete reference documentation for all API endpoints.
---
```

**Body with tables and notes:**

```markdown
# API Reference

The API provides programmatic access to all platform features.

## Base URL

All API requests use: `https://api.yoursite.com/v1`

## Rate Limits

| Plan | Requests/min | Requests/day |
|------|--------------|--------------|
| Free | 60 | 1,000 |
| Pro | 600 | 50,000 |

## Endpoints

- [Users](/api/users/) for user management
- [Projects](/api/projects/) for project operations
```

**Adding code examples:**

Use fenced code blocks with language hints for syntax highlighting:

```bash
curl -H "Authorization: Bearer YOUR_API_KEY" https://api.yoursite.com/v1/users
```

**Adding callouts:**

```markdown
> [!NOTE]
> The API uses JSON for all request and response bodies.
```

---

## Tutorial Pages

Tutorials walk readers through a process step by step. Structure them with clear prerequisites, numbered steps, and troubleshooting.

### Tutorial Structure

**Frontmatter:**

```yaml
---
title: Creating Your First Project
description: Learn how to create, configure, and deploy your first project.
---
```

**Introduction with prerequisites:**

```markdown
# Creating Your First Project

This tutorial walks you through creating a project from scratch.

## Prerequisites

Before starting, make sure you have:

- An account with admin access
- The CLI tool installed (see [Installation](/getting-started/installation/))
- About 15 minutes of uninterrupted time
```

**Numbered steps with commands:**

```markdown
## Step 1: Initialize the Project

Open your terminal and run the initialization command:
```

Then add a code block:

```bash
project init my-first-project
cd my-first-project
```

**Show directory structures:**

```text
my-first-project/
├── config.yaml
├── src/
│   └── main.js
└── README.md
```

**Add helpful tips:**

```markdown
> [!TIP]
> Use `project run --watch` to automatically restart when files change.
```

**End with next steps:**

```markdown
## Next Steps

Now that you have a running project:

- [Add environment variables](/guides/environment-variables/) for configuration
- [Set up a custom domain](/guides/custom-domains/) for production use
```

---

## Reference Pages

Reference pages document configuration options, API parameters, or other technical details. Use tables for properties and code blocks for examples.

### Reference Structure

**Frontmatter:**

```yaml
---
title: Configuration Options
description: Complete reference for all configuration file settings.
---
```

**Option documentation pattern:**

For each configuration option, document it with a description, property table, and example:

```markdown
### server.port

The port the server listens on.

| Property | Value |
|----------|-------|
| Type | integer |
| Required | No |
| Default | `3000` |
| Range | 1-65535 |
```

Then show an example:

```yaml
server:
  port: 8080
```

**Complete example at the end:**

```markdown
## Complete Example

Here is a complete configuration file with common settings:
```

```yaml
name: customer-portal
version: 2.1.0
environment: production

server:
  port: 8080
  host: 0.0.0.0

database:
  url: postgres://localhost/mydb
  pool_size: 10
```

---

## Pages with Multiple Features

Real documentation pages combine many markdown features. Here's how they work together.

### Tables for Comparisons

```markdown
| Method | Best For | Complexity |
|--------|----------|------------|
| API Keys | Server-to-server | Low |
| OAuth 2.0 | User-facing apps | Medium |
| Sessions | Web applications | Medium |
```

### Task Lists for Checklists

```markdown
- [x] API keys stored in environment variables
- [x] HTTPS enforced for all endpoints
- [ ] Rate limiting configured
- [ ] Key rotation schedule established
```

### Footnotes for References

```markdown
Rotate keys periodically to limit exposure if a key is compromised[^1].

[^1]: Industry best practice recommends rotating keys every 90 days.
```

### Alert Callouts

Use different alert types for different purposes:

```markdown
> [!NOTE]
> Informational content that adds context.

> [!TIP]
> Helpful suggestions that improve the experience.

> [!IMPORTANT]
> Critical information users should not miss.

> [!WARNING]
> Potential issues users should be aware of.

> [!CAUTION]
> Dangerous actions that could cause problems.
```

---

## Troubleshooting Pages

Troubleshooting pages help readers solve problems. Structure each issue with the error message, cause, and solution.

### Troubleshooting Pattern

```markdown
## Module Not Found

### Error Message
```

Show the exact error:

```text
Error: Cannot find module 'example-package'
    at Function.Module._resolveFilename (node:internal/modules/cjs/loader:933:15)
```

Then explain and solve:

```markdown
### Cause

The required package is not installed in your `node_modules` directory.

### Solution

Install the missing package:
```

```bash
npm install example-package
```

Add helpful context:

```markdown
> [!TIP]
> Run `npm ls example-package` to check if a package is installed.
```

---

## FAQ Pages

FAQ pages answer common questions concisely. Group related questions under headings.

### FAQ Pattern

```markdown
## Getting Started

### Do I need a database?

No. The application runs without a database by default, storing data in memory. For production use, we recommend connecting a persistent database.

### What Node.js version do I need?

Node.js 18 or later. Check your version with:
```

```bash
node --version
```

```markdown
## Configuration

### How do I change the default port?

Set the `PORT` environment variable:
```

```bash
PORT=8080 npm start
```

---

## Best Practices

When creating documentation pages:

1. **Start with frontmatter** - Always include `title` and `description`
2. **Use clear headings** - Structure content with `##` and `###` headings
3. **Show, don't just tell** - Include code examples for technical content
4. **Add callouts sparingly** - Use alerts for genuinely important information
5. **Link to related pages** - Help readers discover more content
6. **End with next steps** - Guide readers to continue their journey

> [!TIP]
> When creating new pages, copy the structure from similar existing pages and modify for your needs. Consistent structure helps readers navigate your documentation.
