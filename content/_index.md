---
title: MarkStack Documentation
description: Official documentation for MarkStack, a modern static site generator that transforms markdown files into a fast, searchable documentation website with zero configuration.
---

# Welcome to MarkStack

MarkStack is a static site generator purpose-built for documentation and knowledge bases. It takes the markdown files you write in a simple folder structure and transforms them into a polished, professional documentation website complete with search, navigation, syntax highlighting, and dark/light themes.

This entire documentation site was built using MarkStack itself, so everything you see here demonstrates exactly what the tool can produce. The sidebar navigation, the search bar, the code blocks with copy buttons, the alerts and callouts, and even the theme toggle in the header are all generated from plain markdown files.

## What Makes MarkStack Different

Unlike heavier documentation frameworks that require complex configuration files, plugins, and build pipelines, MarkStack follows a philosophy of simplicity:

- **Single build script**: The entire generator is one JavaScript file with no compilation step. You can read it, understand it, and modify it.
- **Folder-based navigation**: Your folder structure becomes your sidebar. Create a folder, add markdown files, and navigation appears automatically.
- **Zero configuration to start**: Clone the repository, run `npm install`, and you have a working documentation site. Configuration is optional, not required.
- **Fast builds**: Most sites rebuild in under 100 milliseconds, making the write-preview-iterate loop almost instantaneous.
- **Portable output**: The generated `dist/` folder contains pure static HTML, CSS, and JavaScript. Host it anywhere that serves files: GitHub Pages, Netlify, Vercel, a simple web server, or even a USB drive.

## How It Works

The build process follows a straightforward pipeline:

1. **Scan**: MarkStack reads every `.md` file in your `content/` directory
2. **Parse**: Each file's frontmatter (the YAML at the top) provides metadata like title and description
3. **Transform**: Markdown content converts to HTML with syntax highlighting, GitHub-style alerts, task lists, and more
4. **Assemble**: Navigation trees, breadcrumbs, and search indexes generate automatically from the folder structure
5. **Output**: Everything writes to `dist/` as clean, fast-loading static HTML

## Documentation Guide

This documentation covers everything you need to go from first install to production deployment. Here is the recommended reading path:

### For New Users

Start with the [Getting Started](/getting-started/) section. It walks through prerequisites, installation, and your first build in about five minutes. You will learn the basic workflow and have a running site to experiment with.

### For Content Authors

The [Authoring Content](/authoring/) section explains how to structure your documentation. Learn about the content model, how frontmatter works, the full range of markdown features supported (including code blocks, alerts, task lists, footnotes, and more), and best practices for organizing large documentation projects.

### For Site Administrators

[Configuration](/configuration/) covers the `siteconfig.json` file where you set your site title, description, URLs, and homepage behavior. [Customization](/customization/) goes deeper into themes, CSS variables, template modifications, and branding.

### For DevOps and Deployment

[Build and Deploy](/build-deploy/) provides the commands reference, CI/CD pipeline examples for GitHub Actions and other platforms, and guides for deploying to popular hosting providers like GitHub Pages, Netlify, Vercel, and Cloudflare Pages.

### For Contributors and Advanced Users

The [Architecture](/architecture/) section documents how MarkStack works internally. Understand the build pipeline, how navigation and routing decisions are made, and how the search index generates. This knowledge helps if you want to extend or customize the generator itself.

### When Things Go Wrong

[Troubleshooting](/troubleshooting/) collects solutions to common issues and answers frequently asked questions. Check here before opening an issue if something is not working as expected.

## Quick Reference

Here are the commands you will use most often:

| Command | Purpose |
|---------|---------|
| `npm run build` | Generate the site once into `dist/` |
| `npm run watch` | Rebuild automatically when files change |
| `npm run serve` | Start a local preview server at `http://localhost:3000` |
| `npm run clean` | Delete `dist/` for a fresh start |

A typical authoring workflow uses two terminal windows:

```bash
# Terminal 1: Auto-rebuild on changes
npm run watch

# Terminal 2: Preview server
npm run serve
```

With this setup, you can edit markdown files, save them, and refresh your browser to see changes immediately.

## What You Will Find in This Documentation

Every section aims to be practical and complete:

- Step-by-step instructions you can follow without prior knowledge
- Code samples you can copy and paste directly
- Examples that mirror real folder structures and configurations
- Explanations of why things work the way they do, not just how
- Tips and warnings called out in styled alert boxes

> [!TIP]
> As you read through the documentation, keep a terminal running `npm run watch` in your MarkStack project. Try out concepts as you learn them. The instant rebuild makes experimentation fast and safe.

## Getting Help

If you run into issues not covered in the documentation:

1. Check the [Common Issues](/troubleshooting/common-issues/) page for known solutions
2. Review the [FAQ](/troubleshooting/faq/) for quick answers to frequent questions
3. Search the GitHub repository issues for similar problems
4. Open a new issue with details about your environment and what you tried

Welcome to MarkStack. Let's build something great.
