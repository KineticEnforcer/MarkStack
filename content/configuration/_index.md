---
title: Configuration
description: Learn how to configure your MarkStack site using siteconfig.json for site identity, metadata, and homepage behavior.
---

# Configuration

MarkStack keeps configuration simple. A single JSON file controls all site-wide settings, from the site title to homepage behavior. This section explains every configuration option and how to use them effectively.

## Configuration Overview

All site configuration lives in `siteconfig.json` at your project root. This file controls:

- **Site identity**: The name and branding that appears throughout your site
- **Metadata**: Default descriptions and URLs used in search engines and social sharing
- **Homepage behavior**: Whether to show a hero section and what content to display

There is no complex configuration file format to learn. JSON is straightforward, and MarkStack uses sensible defaults for anything you do not specify.

## What This Section Covers

### Site Config

The [Site Config](/configuration/siteconfig/) guide provides a complete reference for `siteconfig.json`:

- Every available field with its purpose
- How each field affects your site
- Example configurations for different use cases
- Tips for SEO and social sharing optimization

This is the essential reference when setting up a new MarkStack site or adjusting existing settings.

### Homepage Content

The [Homepage Content](/configuration/homepage/) guide explains how to customize your homepage:

- How the hero section works and when to use it
- Adding custom markdown content below the hero
- Creating a homepage without the hero section
- Balancing site configuration with content

The homepage combines settings from `siteconfig.json` with optional content from `content/_index.md`, giving you flexibility in how you welcome visitors.

## Quick Start Configuration

If you are setting up MarkStack for the first time, here is a minimal configuration to get started:

```json
{
  "siteTitle": "My Documentation",
  "headerTitle": "MyDocs",
  "siteUrl": "https://docs.example.com"
}
```

Save this as `siteconfig.json` in your project root, then run `npm run build`. You now have a configured site with your branding.

## Configuration Best Practices

| Practice | Reason |
|----------|--------|
| Set `siteUrl` to your production URL | Ensures Open Graph tags and canonical URLs are correct |
| Keep `siteTitle` concise | Appears in browser tabs and search results |
| Write a meaningful `defaultDescription` | Used when pages lack their own description |
| Decide on hero visibility early | Affects how you structure homepage content |

## When to Rebuild

After changing `siteconfig.json`, run `npm run build` (or let `npm run watch` rebuild automatically). Configuration changes apply to all pages, so every page regenerates with the new values.

> [!TIP]
> Keep `npm run watch` running while adjusting configuration. You can edit `siteconfig.json`, save it, and immediately see the results in your browser preview.
