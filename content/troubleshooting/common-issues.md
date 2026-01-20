---
title: Common Issues
description: Solutions for common MarkStack problems including build errors, missing pages, styling issues, and deployment failures.
---

# Common Issues

This page documents common problems and their solutions. Issues are organized by category for easy reference.

## Build Errors

### Cannot find module 'X'

**Symptoms:**
```
Error: Cannot find module 'markdown-it'
Error: Cannot find module 'gray-matter'
Error: Cannot find module 'chokidar'
```

**Cause:** Dependencies are not installed.

**Solution:**
```bash
npm install
```

If that does not work, try a clean install:
```bash
rm -rf node_modules package-lock.json
npm install
```

### ENOENT: no such file or directory

**Symptoms:**
```
Error: ENOENT: no such file or directory, open 'content/xyz.md'
Error: ENOENT: no such file or directory, open 'templates/base.html'
```

**Cause:** A file or directory that the build script expects is missing.

**Solution:**

1. Verify you are in the correct directory:
   ```bash
   pwd  # Should show your MarkStack project folder
   ls   # Should show content/, templates/, build.js, etc.
   ```

2. If `content/` is missing, create it:
   ```bash
   mkdir content
   ```

3. If `templates/base.html` is missing, you may need to restore it from version control or reinstall MarkStack.

### SyntaxError in siteconfig.json

**Symptoms:**
```
SyntaxError: Unexpected token } in JSON at position 123
Warning: Could not parse siteconfig.json, using defaults
```

**Cause:** Invalid JSON syntax in the configuration file.

**Solution:**

1. Open `siteconfig.json` and check for:
   - Missing commas between properties
   - Trailing commas after the last property
   - Unquoted strings
   - Single quotes instead of double quotes

2. Validate your JSON:
   ```bash
   node -e "console.log(JSON.parse(require('fs').readFileSync('siteconfig.json')))"
   ```

3. Use a JSON validator online or in your editor.

Correct format:
```json
{
  "siteTitle": "My Site",
  "siteUrl": "https://example.com"
}
```

Common mistakes:
```json
{
  "siteTitle": "My Site",   // Trailing comma - WRONG
}

{
  siteTitle: "My Site"      // Unquoted key - WRONG
}

{
  "siteTitle": 'My Site'    // Single quotes - WRONG
}
```

### Invalid YAML frontmatter

**Symptoms:**
```
YAMLException: bad indentation of a mapping entry
YAMLException: can not read a block mapping entry
```

**Cause:** Syntax error in the YAML frontmatter of a markdown file.

**Solution:**

1. Check the frontmatter uses correct YAML syntax:
   ```yaml
   ---
   title: My Page Title
   description: A description of this page
   ---
   ```

2. Common mistakes:
   - Incorrect indentation (use spaces, not tabs)
   - Missing space after the colon
   - Unquoted special characters

3. Quote values with special characters:
   ```yaml
   ---
   title: "Getting Started: A Guide"
   description: "Learn about the 'features' here"
   ---
   ```

### Build hangs or never completes

**Symptoms:** The build starts but never finishes, or takes an extremely long time.

**Cause:** Usually caused by very large files, circular references, or filesystem issues.

**Solution:**

1. Check for very large markdown files (over 1MB)
2. Look for files that should not be in `content/`:
   ```bash
   find content -size +1M
   ```
3. Ensure no symbolic links create circular references
4. Try building with fewer files to isolate the problem

## Missing or Incorrect Pages

### Page does not appear in navigation

**Symptoms:** A markdown file exists but does not show in the sidebar.

**Causes and Solutions:**

1. **File not in content/ directory**
   - Verify the file is inside `content/`, not at the project root

2. **Hidden file**
   - Files starting with `.` are ignored
   - Rename `.hidden.md` to `hidden.md`

3. **Not a .md file**
   - Only `.md` files are processed
   - Rename `.markdown` or `.txt` to `.md`

4. **Build cache issue**
   - Run `npm run clean && npm run build`

### Page shows wrong title

**Symptoms:** The navigation shows a different title than expected.

**Cause:** MarkStack uses the frontmatter title, falling back to the filename.

**Solution:**

1. Check your frontmatter:
   ```yaml
   ---
   title: Expected Title Here
   ---
   ```

2. If no frontmatter, the title is derived from the filename:
   - `my-page.md` becomes "My Page"
   - `MyPage.md` becomes "MyPage" (no transformation)

### Page URL is wrong

**Symptoms:** The page is at `/my-page/` but you expected `/different-url/`.

**Cause:** URLs are generated from titles, not filenames.

**Solution:**

1. The URL comes from the `title` in frontmatter (slugified)
2. To change the URL, change the title:
   ```yaml
   ---
   title: Different URL
   ---
   ```
   This creates `/different-url/`

### 404 for a page that exists

**Symptoms:** Clicking a navigation link shows 404.

**Causes and Solutions:**

1. **URL mismatch**
   - The link URL does not match the generated URL
   - Check that the page title has not changed

2. **Server configuration**
   - Your server may not handle clean URLs correctly
   - For nginx, add: `try_files $uri $uri/ $uri/index.html =404;`

3. **Case sensitivity**
   - Linux servers are case-sensitive
   - `/Getting-Started/` is different from `/getting-started/`

## Styling Issues

### Styles not loading

**Symptoms:** Page appears unstyled, plain HTML.

**Cause:** CSS files are not being served or paths are wrong.

**Solution:**

1. Verify CSS files exist in `dist/css/`:
   ```bash
   ls dist/css/
   # Should show main.css, hljs-theme.css
   ```

2. Check browser network tab for 404 errors on CSS

3. If self-hosting, ensure your server serves static files from `dist/`

4. Verify the base path is correct (for subdirectory hosting)

### Theme toggle does not work

**Symptoms:** Clicking the theme button does nothing.

**Cause:** JavaScript error or missing script.

**Solution:**

1. Check browser console for errors (press F12)

2. Verify `app.js` exists:
   ```bash
   ls dist/js/app.js
   ```

3. Check for JavaScript errors in the console

4. Ensure no Content Security Policy blocks inline scripts

### Code blocks not highlighted

**Symptoms:** Code appears but without syntax colors.

**Cause:** Missing language identifier or highlight.js issue.

**Solution:**

1. Specify the language in code blocks:
   ````markdown
   ```javascript
   const x = 1;
   ```
   ````

2. Check that `hljs-theme.css` loads:
   ```bash
   ls dist/css/hljs-theme.css
   ```

3. Verify the language is supported by highlight.js

### Layout broken on mobile

**Symptoms:** Sidebar overlaps content, text too small.

**Cause:** CSS responsive rules not applied or viewport meta missing.

**Solution:**

1. Check that `templates/base.html` includes the viewport meta:
   ```html
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   ```

2. Clear browser cache and reload

3. Check for custom CSS that might override responsive rules

## Search Issues

### Search returns no results

**Symptoms:** Searching shows "No results found" for terms that should match.

**Causes and Solutions:**

1. **Search index not generated**
   ```bash
   ls dist/search-index.json
   # File should exist and not be empty
   ```

2. **Index not loading**
   - Check browser network tab for errors loading `search-index.json`
   - Check browser console for JavaScript errors

3. **Query too short**
   - Search requires at least 2 characters
   - Try longer search terms

4. **Content not indexed**
   - Rebuild: `npm run build`
   - Check that pages have content (not empty)

### Search is slow

**Symptoms:** Noticeable delay when typing in search.

**Cause:** Large search index or slow device.

**Solution:**

1. Enable gzip compression on your server
2. Consider limiting indexed content length in `build.js`
3. The search debounces by 150ms; this is normal

### Ctrl+K shortcut does not work

**Symptoms:** Pressing Ctrl+K does not focus the search box.

**Cause:** Browser or extension intercepting the shortcut.

**Solution:**

1. Some browsers use Ctrl+K for address bar search
2. Some extensions may capture this shortcut
3. Click the search box instead, or press Tab to navigate to it

## Deployment Issues

### Site works locally but not deployed

**Symptoms:** Everything works with `npx serve dist` but fails on the hosting platform.

**Causes and Solutions:**

1. **Build not running on host**
   - Verify build command is configured: `npm run build`
   - Check platform build logs for errors

2. **Wrong output directory**
   - Ensure publish directory is set to `dist`
   - Not `build`, `public`, or `out`

3. **Missing dependencies**
   - Ensure `package-lock.json` is committed
   - Use `npm ci` instead of `npm install` in CI

4. **Node version mismatch**
   - Specify Node version in platform settings
   - Use Node 18 or higher

### Clean URLs not working

**Symptoms:** `/about/` returns 404, but `/about/index.html` works.

**Cause:** Server not configured for clean URLs.

**Solution:**

For Netlify, add `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

For nginx:
```nginx
location / {
  try_files $uri $uri/ $uri/index.html =404;
}
```

For Apache `.htaccess`:
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*)$ $1/index.html [L]
```

### Mixed content warnings

**Symptoms:** Browser shows security warnings, some resources do not load.

**Cause:** Loading HTTP resources on an HTTPS site.

**Solution:**

1. Ensure all resource URLs in templates use `https://` or protocol-relative `//`
2. Check `siteconfig.json` uses `https://` for `siteUrl`
3. Search generated HTML for `http://` and update sources

### Assets not found after deploy

**Symptoms:** CSS, JS, or images return 404 on production.

**Cause:** Path issues or incomplete deploy.

**Solution:**

1. Verify all files in `dist/` were uploaded
2. Check that paths use leading slash: `/css/main.css`
3. If deployed to subdirectory, update base paths

## Watch Mode Issues

### Watch does not detect changes

**Symptoms:** Saving files does not trigger rebuild.

**Causes and Solutions:**

1. **Saving to wrong location**
   - Verify you are editing files in `content/`

2. **Editor not saving**
   - Check auto-save settings
   - Manually save with Ctrl+S

3. **Filesystem events not propagating**
   - Some network drives or Docker volumes have issues
   - Try manual build: `npm run build`

4. **Too many files**
   - Operating systems limit watched files
   - On Linux, increase limit: `echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf`

### Watch uses high CPU

**Symptoms:** `npm run watch` consumes significant CPU.

**Cause:** Watching too many files or filesystem polling.

**Solution:**

1. Ensure `node_modules` is not being watched
2. Close other applications that might compete for filesystem events
3. Use `npm run build` for one-off builds

> [!TIP]
> Most issues can be resolved by reinstalling dependencies (`npm install`) and doing a clean build (`npm run clean && npm run build`). Try this first before investigating further.
