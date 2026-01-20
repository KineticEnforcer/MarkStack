---
title: Troubleshooting
description: Find solutions to common problems, error messages, and frequently asked questions about MarkStack.
---

# Troubleshooting

When things do not work as expected, this section helps you diagnose and fix issues. Start with Common Issues for error messages and symptoms, or check the FAQ for general questions.

## Quick Diagnostics

Before diving into specific issues, try these basic checks:

### 1. Verify Node.js Version

```bash
node --version
```

MarkStack requires Node.js 18.0.0 or higher. If your version is older, upgrade Node.js.

### 2. Reinstall Dependencies

```bash
rm -rf node_modules
npm install
```

On Windows:
```powershell
Remove-Item -Recurse -Force node_modules
npm install
```

### 3. Clean Build

```bash
npm run clean
npm run build
```

### 4. Check for Syntax Errors

If a specific page fails, check the markdown file for:
- Unclosed code blocks (missing closing ```)
- Invalid YAML in frontmatter
- Unmatched brackets or parentheses

## This Section Covers

### Common Issues

The [Common Issues](/troubleshooting/common-issues/) page documents:

- Build errors and their solutions
- Missing page problems
- Styling issues
- Search not working
- Deployment problems

Each issue includes symptoms, causes, and step-by-step solutions.

### FAQ

The [FAQ](/troubleshooting/faq/) page answers frequently asked questions:

- How do I do X?
- Why does Y happen?
- Can MarkStack do Z?

## Getting Help

If you cannot find a solution here:

1. **Search the documentation**: Use Ctrl+K to search for keywords
2. **Check GitHub Issues**: Someone may have reported the same problem
3. **Open a new issue**: Provide details about your environment and the problem

When reporting issues, include:
- Node.js version (`node --version`)
- Operating system
- Complete error message
- Steps to reproduce the problem

## Error Message Quick Reference

| Error | Likely Cause | Solution |
|-------|--------------|----------|
| `Cannot find module` | Dependencies not installed | Run `npm install` |
| `ENOENT: no such file` | Missing file or directory | Check file paths |
| `SyntaxError: Unexpected token` | Invalid JSON or YAML | Check configuration files |
| `EACCES: permission denied` | File permission issue | Check folder permissions |
| `EADDRINUSE` | Port already in use | Use a different port |

## Debugging Tips

### Enable Verbose Output

Add console.log statements to `build.js` to trace execution:

```javascript
console.log('Processing:', filePath);
console.log('URL Map:', urlMap.get(filePath));
```

### Check Generated Files

Inspect files in `dist/` to see what was actually generated:

```bash
# List all generated files
find dist -name "*.html" | head -20

# View a specific file
cat dist/getting-started/index.html
```

On Windows:
```powershell
Get-ChildItem dist -Recurse -Filter *.html | Select-Object -First 20
Get-Content dist\getting-started\index.html
```

### Browser Developer Tools

Press F12 in your browser to open developer tools:

- **Console**: View JavaScript errors
- **Network**: Check if resources load
- **Elements**: Inspect generated HTML

> [!TIP]
> Most issues fall into a few categories: missing dependencies, invalid content syntax, or configuration errors. The solutions are usually simple once you identify the category.
