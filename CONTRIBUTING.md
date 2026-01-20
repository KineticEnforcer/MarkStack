# Contributing to MarkStack

Thank you for your interest in contributing to MarkStack. This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Reporting Issues](#reporting-issues)

---

## Code of Conduct

This project follows a simple principle: be respectful and constructive. We welcome contributors of all experience levels and backgrounds. Harassment, discrimination, or disrespectful behavior will not be tolerated.

---

## Getting Started

Before contributing, familiarize yourself with the project:

1. Read the [README.md](README.md) to understand what MarkStack does
2. Review the [project structure](content/getting-started/project-structure.md)
3. Explore the [architecture documentation](content/architecture/) to understand how the build system works
4. Run the project locally to see it in action

---

## How to Contribute

There are several ways to contribute to MarkStack:

| Contribution Type | Description |
|-------------------|-------------|
| **Bug Reports** | Report issues you encounter while using MarkStack |
| **Feature Requests** | Suggest new features or improvements |
| **Documentation** | Improve or expand the documentation |
| **Code** | Fix bugs, implement features, or improve performance |
| **Testing** | Test on different platforms and report compatibility issues |

---

## Development Setup

### Prerequisites

- Node.js 18.0.0 or higher
- Git
- A text editor or IDE

### Local Setup

```bash
# Fork the repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/markstack.git
cd markstack

# Install dependencies
npm ci

# Build the site
npm run build

# Start the development server
npm run serve
```

### Development Workflow

For active development, use the watch mode:

```bash
# Terminal 1: Watch for changes
npm run watch

# Terminal 2: Serve the site
npm run serve
```

This automatically rebuilds the site when you modify content, templates, or static files.

---

## Pull Request Process

### Before Submitting

1. **Check existing issues and PRs** to avoid duplicate work
2. **Create an issue first** for significant changes to discuss the approach
3. **Fork the repository** and create a branch from `main`
4. **Test your changes** thoroughly before submitting

### Branch Naming

Use descriptive branch names:

| Type | Format | Example |
|------|--------|---------|
| Feature | `feature/description` | `feature/add-table-of-contents` |
| Bug fix | `fix/description` | `fix/search-highlighting` |
| Documentation | `docs/description` | `docs/improve-installation-guide` |
| Refactor | `refactor/description` | `refactor/simplify-url-mapping` |

### Submitting a Pull Request

1. **Update documentation** if your changes affect user-facing features
2. **Test the build** by running `npm run build` and verifying no errors occur
3. **Write a clear PR description** explaining what changes you made and why
4. **Reference related issues** using `Fixes #123` or `Closes #123`
5. **Keep PRs focused** on a single change or closely related changes

### Review Process

- A maintainer will review your PR within a reasonable timeframe
- Address any requested changes by pushing additional commits
- Once approved, your PR will be merged into the main branch

---

## Coding Standards

### JavaScript (build.js)

- Use `'use strict'` at the top of files
- Use `const` by default, `let` when reassignment is needed
- Write descriptive function and variable names
- Add JSDoc comments for functions
- Keep functions focused on a single responsibility

Example:

```javascript
/**
 * Convert a title into a URL-safe slug.
 * @param {string} title - Page or folder title
 * @returns {string} URL-safe slug
 */
function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}
```

### HTML Templates

- Use semantic HTML elements
- Maintain consistent indentation (2 spaces)
- Use `{{placeholder}}` syntax for template variables
- Keep templates readable and well-structured

### CSS

- Use CSS custom properties for theme values
- Follow the existing naming conventions
- Group related properties together
- Add comments for non-obvious styles

### Markdown Content

- Include frontmatter with `title` and `description`
- Use appropriate heading hierarchy (h1 for page title, h2 for sections)
- Keep lines reasonably short for readability in source
- Use GitHub-style alerts sparingly and appropriately

---

## Commit Messages

Write clear, concise commit messages that explain what changed and why.

### Format

```
type: short description

Optional longer description explaining the change in more detail.
```

### Types

| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Formatting, missing semicolons, etc. (no code change) |
| `refactor` | Code restructuring without changing behavior |
| `perf` | Performance improvements |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, or tooling changes |

### Examples

```
feat: add table of contents generation for long pages

fix: resolve search results not highlighting matched terms

docs: expand installation guide with troubleshooting section

refactor: simplify URL mapping logic in build process
```

---

## Reporting Issues

### Bug Reports

When reporting a bug, include:

1. **Description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (Node.js version, operating system)
5. **Error messages** or console output if applicable
6. **Screenshots** if the issue is visual

### Feature Requests

When requesting a feature, include:

1. **Problem statement** describing what you are trying to accomplish
2. **Proposed solution** if you have one in mind
3. **Alternatives considered** and why they are not sufficient
4. **Use case** explaining how this feature would be used

### Issue Labels

Maintainers will add labels to categorize issues:

| Label | Description |
|-------|-------------|
| `bug` | Confirmed bugs |
| `enhancement` | Feature requests |
| `documentation` | Documentation improvements |
| `good first issue` | Suitable for new contributors |
| `help wanted` | Community help appreciated |
| `wontfix` | Will not be addressed |
| `duplicate` | Already reported |

---

## Questions

If you have questions about contributing, open a discussion on GitHub or reach out through the issue tracker. We are happy to help newcomers get started.

---

Thank you for contributing to MarkStack.
