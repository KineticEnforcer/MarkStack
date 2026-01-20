---
title: Getting Started
description: Install MarkStack prerequisites, clone the repository, and generate your first documentation site in under five minutes.
---

# Getting Started

This section takes you from a fresh start to a fully working MarkStack site running on your local machine. By the end, you will have installed all prerequisites, generated your first build, and have a live preview server showing your documentation.

The entire process takes about five minutes if you already have Node.js installed, or about ten minutes if you need to set up Node.js first.

## What This Section Covers

### Prerequisites and Installation

Before you can use MarkStack, you need Node.js and npm installed on your computer. The [Installation](/getting-started/installation/) guide walks through:

- Checking if you already have Node.js installed
- Which Node.js versions work with MarkStack (and which to avoid)
- How to install Node.js if you need it
- Cloning the MarkStack repository
- Installing JavaScript dependencies with npm
- Running your first build to verify everything works

### The Development Workflow

Once installed, you will use MarkStack in a cycle of editing, building, and previewing. The [Quickstart](/getting-started/quickstart/) guide shows you:

- How to run a one-time build that generates your site
- How to start the preview server to view your documentation locally
- How to enable watch mode so the site rebuilds automatically as you edit
- The recommended two-terminal workflow for the fastest authoring experience
- How to clean the output directory when you need a fresh start

### Understanding the Project

MarkStack uses a specific folder structure where some directories contain your source content and others contain generated output. The [Project Structure](/getting-started/project-structure/) guide explains:

- Which folders you should edit (your content lives here)
- Which folders are generated (do not edit these directly)
- What each folder contains and its purpose
- How files in `content/` become pages in `dist/`
- Where to put images, CSS, JavaScript, and other assets

## Recommended Reading Order

If you are new to MarkStack, read these guides in order:

1. **[Installation](/getting-started/installation/)** gets your environment ready and verifies the build works
2. **[Quickstart](/getting-started/quickstart/)** teaches the daily workflow of editing and previewing
3. **[Project Structure](/getting-started/project-structure/)** gives you the mental map of what goes where

After completing this section, you will be ready to move on to [Authoring Content](/authoring/) where you learn how to write and organize your documentation.

## System Requirements

MarkStack has minimal requirements:

| Requirement | Details |
|-------------|---------|
| **Node.js** | Version 18 or later (LTS releases recommended) |
| **npm** | Comes bundled with Node.js |
| **Operating System** | Windows, macOS, or Linux |
| **Disk Space** | Less than 50 MB for dependencies |
| **Text Editor** | Any editor that handles markdown (VS Code recommended) |

> [!TIP]
> Use a Node.js LTS (Long Term Support) release like Node 18 or Node 20. These versions receive security updates and bug fixes for years, making them the safest choice for production documentation sites.

## Time Estimates

| Task | Time |
|------|------|
| Install Node.js (if needed) | 5 minutes |
| Clone repository and install dependencies | 2 minutes |
| First build and verification | 1 minute |
| Learn the development workflow | 5 minutes |
| Understand project structure | 5 minutes |

Most users complete the entire Getting Started section in 10 to 15 minutes.
