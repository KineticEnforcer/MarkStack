---
title: Site Config
description: Complete reference for siteconfig.json, covering every configuration field with examples, default values, and best practices for SEO and branding.
---

# Site Config

The `siteconfig.json` file controls the identity and behavior of your MarkStack site. This reference documents every available field, explains how each one affects your site, and provides guidance on choosing the right values.

## File Location and Format

The configuration file must be named `siteconfig.json` and placed in your project root:

```
markstack/
├── siteconfig.json   <-- Configuration file
├── build.js
├── content/
└── ...
```

The file uses standard JSON format:

```json
{
  "siteTitle": "My Documentation",
  "headerTitle": "MyDocs",
  "siteSubtitle": "Everything you need to know",
  "siteUrl": "https://docs.example.com",
  "defaultDescription": "Official documentation and guides",
  "showHero": true,
  "copyrightText": "© 2024 My Company. All rights reserved."
}
```

## Configuration Fields

### siteTitle

The full name of your site. This is the primary title used throughout your documentation.

| Property | Value |
|----------|-------|
| Type | String |
| Required | No |
| Default | `"Knowledge Base"` |

**Where it appears:**

- Browser tab titles (format: "Page Title | Site Title")
- The hero section on the homepage (when enabled)
- Open Graph meta tags for social sharing

**Example:**

```json
{
  "siteTitle": "Acme Platform Documentation"
}
```

**Best practices:**

- Keep it under 60 characters so it displays fully in search results
- Include your product or company name for brand recognition
- Make it descriptive enough that readers know what the site covers

### headerTitle

A shorter version of your site title displayed in the site header.

| Property | Value |
|----------|-------|
| Type | String |
| Required | No |
| Default | Uses `siteTitle` value |

**Where it appears:**

- The site header next to the logo
- Displayed on every page

**Example:**

```json
{
  "siteTitle": "Acme Platform Documentation",
  "headerTitle": "Acme Docs"
}
```

**When to use:**

Use `headerTitle` when your `siteTitle` is too long to fit comfortably in the header. A long title like "Acme Platform Complete Documentation and API Reference" looks better shortened to "Acme Docs" in the header while keeping the full title for browser tabs and search results.

If `headerTitle` is not set, the header displays `siteTitle`.

### siteSubtitle

A tagline or description displayed below the main title in the hero section.

| Property | Value |
|----------|-------|
| Type | String |
| Required | No |
| Default | `""` (empty string) |

**Where it appears:**

- Below the title in the homepage hero section
- Only visible when `showHero` is `true`

**Example:**

```json
{
  "siteTitle": "Acme Platform Documentation",
  "siteSubtitle": "Guides, tutorials, and API reference for developers"
}
```

**Best practices:**

- Keep it to one sentence
- Explain what readers will find or what problem the documentation solves
- Leave empty (or omit) if you prefer a minimal hero

### siteUrl

The full URL where your site will be hosted in production.

| Property | Value |
|----------|-------|
| Type | String |
| Required | No |
| Default | `""` (empty string) |

**Where it appears:**

- Canonical URL meta tags
- Open Graph `og:url` meta tags
- Generates full URLs in `sitemap.xml` if you add one

**Example:**

```json
{
  "siteUrl": "https://docs.acme.com"
}
```

**Important notes:**

- Include the protocol (`https://`)
- Do not include a trailing slash
- Use your production URL, not localhost
- This value is used at build time, so changes require a rebuild

**Why it matters:**

Search engines use the canonical URL to understand the authoritative location of your content. Social media platforms use `og:url` when your pages are shared. Setting this correctly improves SEO and ensures shared links work properly.

### defaultDescription

A fallback description used when pages do not specify their own description in frontmatter.

| Property | Value |
|----------|-------|
| Type | String |
| Required | No |
| Default | `"Documentation and knowledge base"` |

**Where it appears:**

- HTML `<meta name="description">` tag on pages without frontmatter descriptions
- Open Graph `og:description` tag on pages without frontmatter descriptions
- Search result snippets for pages without descriptions

**Example:**

```json
{
  "defaultDescription": "Official documentation for Acme Platform including guides, tutorials, and API reference."
}
```

**Best practices:**

- Write 150 to 160 characters (search engines truncate longer descriptions)
- Summarize what readers will find in your documentation
- Use complete sentences with natural language
- Include important keywords naturally
- Add specific descriptions to important pages rather than relying on this default

### showHero

Controls whether the hero section appears on the homepage.

| Property | Value |
|----------|-------|
| Type | Boolean |
| Required | No |
| Default | `true` |

**What the hero section includes:**

- `siteTitle` as a large heading
- `siteSubtitle` below the title
- Styled background section at the top of the homepage

**Example (hero enabled):**

```json
{
  "siteTitle": "Acme Documentation",
  "siteSubtitle": "Everything you need to build with Acme",
  "showHero": true
}
```

**Example (hero disabled):**

```json
{
  "showHero": false
}
```

**When to disable the hero:**

- You want a compact homepage that jumps straight to content
- Your homepage content in `content/_index.md` serves as its own introduction
- You prefer a more utilitarian, content-focused design

### copyrightText

Text displayed in the footer of every page.

| Property | Value |
|----------|-------|
| Type | String |
| Required | No |
| Default | `""` (empty string) |

**Where it appears:**

- The site footer on all pages

**Example:**

```json
{
  "copyrightText": "© 2024 Acme Inc. All rights reserved."
}
```

**Best practices:**

- Include the copyright symbol (©), year, and your company or name
- Keep it brief since footer space is limited
- Update the year when it changes (or use a build script to automate this)

## Complete Configuration Examples

### Minimal Configuration

For a simple documentation site with defaults:

```json
{
  "siteTitle": "Project Docs",
  "siteUrl": "https://docs.example.com"
}
```

### Full Configuration

Using all available options:

```json
{
  "siteTitle": "Acme Platform Documentation",
  "headerTitle": "Acme Docs",
  "siteSubtitle": "Comprehensive guides and API reference for developers",
  "siteUrl": "https://docs.acme.com",
  "defaultDescription": "Official documentation for Acme Platform. Learn how to integrate, customize, and deploy.",
  "showHero": true,
  "copyrightText": "© 2024 Acme Inc. Licensed under MIT."
}
```

### Compact Style (No Hero)

For documentation that focuses on content:

```json
{
  "siteTitle": "Technical Reference",
  "headerTitle": "TechRef",
  "siteUrl": "https://ref.example.com",
  "defaultDescription": "Technical reference documentation and specifications.",
  "showHero": false,
  "copyrightText": "© 2024 Example Corp."
}
```

### Open Source Project

For an open source project's documentation:

```json
{
  "siteTitle": "AwesomeLib Documentation",
  "headerTitle": "AwesomeLib",
  "siteSubtitle": "A powerful library for doing awesome things",
  "siteUrl": "https://awesomelib.github.io",
  "defaultDescription": "Documentation for AwesomeLib, the open source library for awesome things.",
  "showHero": true,
  "copyrightText": "Licensed under Apache 2.0. Made with MarkStack."
}
```

## SEO Considerations

Proper configuration improves how your documentation appears in search engines:

### Page Titles

Search results display page titles in the format "Page Title | Site Title". Keep `siteTitle` concise so page titles are not truncated. A title like "Installation Guide | Acme Docs" is better than "Installation Guide | Acme Platform Complete Documentation and Reference".

### Meta Descriptions

The `defaultDescription` appears in search results for pages without their own description. While it is a useful fallback, add specific `description` values to important pages for better search result snippets.

### Canonical URLs

Setting `siteUrl` correctly generates proper canonical URL tags. This tells search engines the authoritative URL for each page, which:

- Prevents duplicate content issues
- Consolidates ranking signals
- Ensures the correct URL appears in search results

## Social Sharing

When someone shares your documentation on social media, the platform reads Open Graph meta tags:

- `og:title` comes from the page title
- `og:description` comes from page description or `defaultDescription`
- `og:url` comes from `siteUrl` combined with the page path

Example of how a shared page appears:

```
Acme Platform Documentation
docs.acme.com

Official documentation for Acme Platform. Learn how to 
integrate, customize, and deploy.
```

> [!TIP]
> After changing `siteconfig.json`, test social sharing by pasting a page URL into the [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) or [Twitter Card Validator](https://cards-dev.twitter.com/validator). These tools show exactly what social platforms see.

## Validation

MarkStack does not validate `siteconfig.json` strictly. If the file is missing or contains invalid JSON, the build uses default values and prints a warning. If a field is missing, its default value applies.

To verify your configuration:

1. Run `npm run build`
2. Open `dist/index.html` in a browser
3. View page source and check meta tags
4. Verify the header shows your expected title
5. Check the footer for copyright text

> [!NOTE]
> JSON does not allow trailing commas. If you see parse errors, check for commas after the last item in objects or arrays.
