---
title: Frontmatter
description: Complete guide to YAML frontmatter in MarkStack, including available fields, best practices for titles and descriptions, and how frontmatter affects navigation, search, and SEO.
---

# Frontmatter

Frontmatter is metadata written in YAML format at the very beginning of each markdown file. It tells MarkStack how to title the page, what description to use in search results and meta tags, and provides other information that affects how the page appears on your site.

This guide explains all available frontmatter fields, how to write effective values, and best practices for different types of pages.

## What Frontmatter Looks Like

Frontmatter appears at the top of a markdown file, wrapped in triple dashes:

```markdown
---
title: Getting Started
description: Learn how to install, configure, and run your first build.
---

# Getting Started

The rest of your content goes here...
```

The triple dashes (`---`) mark where the frontmatter begins and ends. Everything between them is YAML, a simple format for key-value pairs. Everything after the closing dashes is your markdown content.

## Available Fields

MarkStack currently supports two frontmatter fields:

### title

The `title` field sets the page title. This value appears in:

- The browser tab/window title
- The sidebar navigation label
- The breadcrumb trail
- The page's HTML `<title>` tag
- Open Graph meta tags for social sharing

```yaml
---
title: Installation Guide
---
```

**When to use:** Always set a title for important pages. It gives you control over exactly how the page appears in navigation and search results.

**When it is optional:** If you omit the title, MarkStack derives one from the filename:

| Filename | Derived Title |
|----------|--------------|
| `installation.md` | Installation |
| `quick-start.md` | Quick Start |
| `api-reference.md` | Api Reference |

The derived title applies basic formatting (replacing hyphens with spaces, capitalizing first letters), but it may not be exactly what you want. For example, "api-reference.md" becomes "Api Reference" rather than "API Reference."

### description

The `description` field provides a short summary of what the page covers. This value appears in:

- The HTML `<meta name="description">` tag (important for SEO)
- Search result snippets in the MarkStack search box
- Open Graph meta tags when the page is shared on social media

```yaml
---
title: Installation Guide
description: Step-by-step instructions for installing the software on Windows, macOS, and Linux, including prerequisites and troubleshooting tips.
---
```

**When to use:** Add descriptions to every page you want to be discoverable in search engines. The description helps users decide whether a search result is relevant to their needs.

**When it is optional:** If you omit the description, MarkStack uses the `defaultDescription` from `siteconfig.json`. This fallback works for pages you do not expect search engines to surface prominently, but it means all those pages show the same generic description in search results.

## Frontmatter for Categories

Category landing pages (`_index.md` files) use the same frontmatter fields, but they apply to the entire category:

```markdown
---
title: Guides
description: Step-by-step tutorials that walk you through common tasks from start to finish.
---

# Guides

Welcome to the guides section...
```

The `title` becomes the sidebar label for the category folder. The `description` appears in the category landing page's meta tags.

Without frontmatter, the category title comes from the folder name. A folder named `getting-started/` without an `_index.md` (or with an `_index.md` missing the title) appears in navigation as "Getting Started."

## Writing Effective Titles

Good titles help readers find information quickly and understand what a page covers. Follow these guidelines:

### Be Specific

Vague titles make navigation harder. Compare:

| Less Effective | More Effective |
|----------------|----------------|
| Setup | Installation on Windows |
| Guide | Complete API Authentication Guide |
| Config | Configuration File Reference |

### Keep Titles Concise

Long titles clutter the sidebar and get truncated in browser tabs. Aim for 3 to 5 words when possible:

| Too Long | Better |
|----------|--------|
| A Complete Guide to Installing and Configuring the Software on Your Machine | Installation Guide |
| Everything You Need to Know About the Configuration File | Configuration Reference |

### Use Consistent Patterns

Pick a capitalization style and stick with it throughout your documentation:

- **Title Case**: Installation Guide, API Reference, Getting Started
- **Sentence case**: Installation guide, API reference, Getting started

Most documentation uses title case for navigation items.

### Remember That Titles Become URLs

Since titles slugify into URLs, consider how the slug will look:

| Title | Resulting URL |
|-------|---------------|
| Getting Started | `/getting-started/` |
| C++ Programming Guide | `/c-programming-guide/` |
| The "Ultimate" Reference | `/the-ultimate-reference/` |

Titles with special characters may produce less readable URLs. "C++ Programming Guide" loses the plus signs and becomes `c-programming-guide`.

## Writing Effective Descriptions

Descriptions serve readers and search engines. A good description:

1. Summarizes the page content accurately
2. Helps readers decide if this page answers their question
3. Uses natural language (not just keywords)
4. Fits in the space search engines display (about 150 to 160 characters)

### Examples

**Good description:**
```yaml
description: Learn how to install MarkStack on Windows, macOS, and Linux with step-by-step instructions and troubleshooting tips for common issues.
```

This description tells readers exactly what they will find and includes relevant terms naturally.

**Less effective description:**
```yaml
description: Installation. Setup. Configuration. Download. Install software. Getting started guide.
```

This reads like a keyword list, not helpful information.

### Description Length

Search engines typically display 150 to 160 characters of the description. Longer descriptions get truncated with an ellipsis (...).

Check your description length:

- Under 150 characters: Safe, will display fully
- 150 to 160 characters: Usually displays fully
- Over 160 characters: Will be truncated

```yaml
# This description is about 140 characters:
description: Install MarkStack in minutes with our step-by-step guide. Covers Windows, macOS, and Linux with troubleshooting tips.
```

### When Pages Share Descriptions

If you omit descriptions from multiple pages, they all inherit `defaultDescription` from `siteconfig.json`. This makes search results less helpful because every page shows the same snippet.

Prioritize adding unique descriptions to:

- Landing pages (homepage, category indexes)
- Frequently accessed pages
- Pages you want search engines to rank

## Complete Examples

### Documentation Page

```markdown
---
title: API Authentication
description: Configure API keys and OAuth tokens to authenticate requests. Includes examples for all supported authentication methods.
---

# API Authentication

This guide explains how to authenticate API requests using API keys, OAuth 2.0 tokens, or service accounts.

## API Keys

Generate an API key from your dashboard...
```

### Category Landing Page

```markdown
---
title: Developer Guides
description: In-depth guides for developers integrating with our platform. Covers authentication, webhooks, SDKs, and best practices.
---

# Developer Guides

These guides help developers build integrations with our platform.

## Where to Start

New developers should begin with the [Quick Start](/guides/quick-start/) tutorial...
```

### Minimal Page

For less important pages, you can use minimal frontmatter:

```markdown
---
title: Changelog
---

# Changelog

## Version 2.1.0

Released December 15, 2024...
```

This page uses the title from frontmatter and inherits the site's default description.

## Frontmatter Best Practices

| Practice | Reason |
|----------|--------|
| Always set `title` | Gives you control over navigation and URLs |
| Add `description` to important pages | Improves search results and SEO |
| Keep titles stable | Changing titles changes URLs, breaking links |
| Use natural language in descriptions | Helps readers, not just search engines |
| Review descriptions for length | Keep under 160 characters to avoid truncation |

## What Happens After Changes

After modifying frontmatter, run `npm run build` (or let `npm run watch` rebuild automatically). The build process:

1. Reads the new frontmatter values
2. Regenerates the URL if the title changed
3. Updates meta tags in the HTML output
4. Rebuilds the search index with new titles and descriptions
5. Updates navigation labels in the sidebar

> [!WARNING]
> Changing a page's title changes its URL. If the page is already published and linked from external sites, those links will break. Either keep titles stable after publishing, or add redirects at your hosting provider when you must change them.

> [!TIP]
> When creating new content, set the title and description in frontmatter before writing the content. This helps you stay focused on what the page should cover.
