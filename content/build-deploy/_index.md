---
title: Build and Deploy
description: Learn how to build, preview, and deploy your MarkStack site to production using various hosting platforms and CI/CD pipelines.
---

# Build and Deploy

This section covers everything you need to know about building your MarkStack site for development and production, deploying to hosting platforms, and setting up automated deployments.

## Build Overview

MarkStack generates a static site from your markdown content. The build process:

1. Reads all markdown files from `content/`
2. Parses frontmatter and converts markdown to HTML
3. Generates navigation (sidebar and breadcrumbs)
4. Applies the HTML template
5. Creates a search index for client-side search
6. Copies static assets
7. Outputs everything to `dist/`

The result is a folder of static HTML, CSS, JavaScript, and assets that can be served by any web server.

## What This Section Covers

### Commands Reference

The [Commands Reference](/build-deploy/commands/) covers all available npm scripts:

- Building for production
- Running a development server with file watching
- Cleaning the build output
- Previewing the built site locally

### Deployment Guide

The [Deployment Guide](/build-deploy/deployment/) explains how to deploy your site:

- Preparing your site for production
- Deploying to popular platforms (Netlify, Vercel, GitHub Pages, Cloudflare Pages)
- Self-hosting with nginx or Apache
- Custom domain configuration

### CI/CD Integration

The [CI/CD Integration](/build-deploy/ci-cd/) guide covers automated deployments:

- GitHub Actions workflow setup
- GitLab CI configuration
- Automated builds on push
- Preview deployments for pull requests

## Quick Reference

### Development Workflow

```bash
# Make changes to content
# Build and watch for changes
npm run watch

# In another terminal, serve the site
npx serve dist

# Preview at http://localhost:3000
```

### Production Build

```bash
# Clean previous build
npm run clean

# Build for production
npm run build

# The dist/ folder is ready to deploy
```

### Deployment Commands

Most platforms deploy automatically when you push to your repository. For manual deployment:

```bash
# Netlify CLI
npx netlify-cli deploy --prod --dir=dist

# Vercel CLI
npx vercel --prod

# GitHub Pages (after setting up workflow)
git push origin main
```

## Build Performance

MarkStack builds are fast. Typical build times:

| Site Size | Build Time |
|-----------|------------|
| 10 pages | ~50ms |
| 50 pages | ~100ms |
| 200 pages | ~300ms |
| 500 pages | ~600ms |

The build script processes files in a single pass with no external API calls, keeping builds consistently quick.

## Static Output

The `dist/` folder contains:

```
dist/
  index.html              # Homepage
  404.html                # Error page
  search-index.json       # Search data
  css/
    main.css              # Site styles
    hljs-theme.css        # Code highlighting
  js/
    app.js                # Interactive features
  svg/
    logo.svg              # Site logo
  [page-slug]/
    index.html            # Each page in its own folder
```

Every page is output as `[slug]/index.html` for clean URLs without file extensions.

## Hosting Requirements

MarkStack sites are purely static and work on any host that serves HTML files. Requirements:

- Ability to serve static files
- Support for clean URLs (rewriting `/page/` to `/page/index.html`)
- HTTPS support (recommended for security)

No server-side processing, databases, or special runtimes are required.

> [!TIP]
> If you are unsure which hosting platform to choose, Netlify and Vercel both offer generous free tiers and automatic deployments from Git repositories.
