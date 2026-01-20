---
title: Installation
description: Complete guide to installing MarkStack prerequisites, cloning the repository, and verifying your development environment works correctly.
---

# Installation

This guide walks through every step needed to get MarkStack running on your machine. Even if you have never used Node.js before, you will have a working installation by the end.

## Prerequisites

Before installing MarkStack, you need two things on your computer:

### Node.js (version 18 or later)

Node.js is a JavaScript runtime that executes the MarkStack build script. MarkStack requires Node.js version 18.0.0 or later because the build script uses modern JavaScript features not available in older versions.

To check if Node.js is already installed, open a terminal and run:

```bash
node --version
```

If you see a version number starting with v18 or higher (like `v18.17.0` or `v20.10.0`), you are ready to proceed. If you see "command not found" or a version below 18, you need to install or upgrade Node.js.

#### Installing Node.js

Download Node.js from the official website: [https://nodejs.org](https://nodejs.org)

Choose the LTS (Long Term Support) version, which is the left button on the download page. LTS versions receive security updates and bug fixes for years, making them the most reliable choice.

**On Windows:** Download the `.msi` installer, run it, and follow the prompts. The installer adds Node.js to your system PATH automatically.

**On macOS:** Download the `.pkg` installer, run it, and follow the prompts. Alternatively, if you use Homebrew, run `brew install node@20`.

**On Linux:** Use your distribution's package manager or download from nodejs.org. For Ubuntu/Debian:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

After installing, close and reopen your terminal, then verify the installation:

```bash
node --version
npm --version
```

Both commands should print version numbers. npm (Node Package Manager) comes bundled with Node.js, so installing Node.js gives you npm automatically.

### Git

Git is used to clone the MarkStack repository. Most developers already have Git installed. Check by running:

```bash
git --version
```

If Git is not installed, download it from [https://git-scm.com](https://git-scm.com) or install via your system's package manager.

## Step 1: Clone the Repository

Open a terminal and navigate to the directory where you want to create your MarkStack project. Then clone the repository:

```bash
git clone https://github.com/KineticEnforcer/MarkStack.git
cd MarkStack
```

This creates a new folder called `markstack` containing all the source files and changes your working directory into it.

> [!NOTE]
> If you want to name your project folder something other than "MarkStack", you can specify a different name when cloning:
> ```bash
> git clone https://github.com/KineticEnforcer/MarkStack.git my-docs-site
> cd my-docs-site
> ```

## Step 2: Install Dependencies

MarkStack uses several npm packages for markdown parsing, syntax highlighting, and file watching. Install all dependencies with a single command:

```bash
npm install
```

This command reads the `package.json` file, downloads all required packages from the npm registry, and stores them in a `node_modules` folder. The process typically takes 10 to 30 seconds depending on your internet connection.

You will see output showing packages being downloaded and installed. When it finishes, you should see a summary like:

```
added 147 packages in 12s
```

The exact number of packages may vary between versions.

## Step 3: Run Your First Build

With dependencies installed, you can now generate the site:

```bash
npm run build
```

This executes the MarkStack build script, which:

1. Scans the `content/` directory for markdown files
2. Parses frontmatter and markdown content
3. Generates HTML pages with navigation and search
4. Copies static assets (CSS, JavaScript, images)
5. Writes everything to the `dist/` folder

A successful build prints output like:

```
🔨 Building MarkStack...

✓ Copied static files

✓ Generated: /getting-started/
✓ Generated: /getting-started/installation/
✓ Generated: /getting-started/quickstart/
... (more pages)
✓ Generated: / (homepage)
✓ Generated: /404.html
✓ Generated: /search-index.json (25 pages)

✅ Build complete in 87ms
📁 Output: /path/to/markstack/dist
```

The build completes in well under a second for most documentation sites.

## Step 4: Verify the Output

After building, your `dist/` folder should contain the generated site. You can check its contents:

```bash
# On macOS/Linux
ls dist/

# On Windows PowerShell
Get-ChildItem dist/
```

You should see:

- `index.html` (the homepage)
- `404.html` (the error page)
- `search-index.json` (the search data)
- `css/` folder (stylesheets)
- `js/` folder (JavaScript)
- `svg/` folder (icons and logo)
- One folder for each documentation section

## Step 5: Preview Locally

To view the generated site in your browser, start the preview server:

```bash
npm run serve
```

This starts a local web server that serves files from `dist/`. Open your browser to:

```
http://localhost:3000
```

You should see the MarkStack documentation site with working navigation, search, and theme toggle. Click around to verify everything works.

Press `Ctrl+C` in the terminal to stop the server when you are done.

## Troubleshooting

### npm install hangs or fails

If `npm install` seems stuck or fails with network errors:

1. Check your internet connection
2. If you are behind a corporate proxy, configure npm to use it:
   ```bash
   npm config set proxy http://your-proxy:port
   npm config set https-proxy http://your-proxy:port
   ```
3. Try clearing the npm cache and reinstalling:
   ```bash
   npm cache clean --force
   npm install
   ```

### Permission errors on macOS or Linux

If you see `EACCES` permission errors:

1. Never use `sudo` with npm. It creates permission problems that are hard to fix.
2. Check that your user owns the project folder:
   ```bash
   ls -la
   ```
3. If needed, fix ownership:
   ```bash
   sudo chown -R $(whoami) .
   ```

### Native module build errors

If you see errors mentioning `gyp`, `node-gyp`, or "native module":

1. Make sure you are using Node.js 18 or later
2. Delete the existing modules and lockfile, then reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

### Windows-specific issues

On Windows, prefer running commands from a normal PowerShell or Command Prompt window rather than an elevated (Administrator) shell. Elevated shells can create files with permissions that cause problems later.

If you use Windows Subsystem for Linux (WSL), you can follow the Linux instructions instead.

### Build fails with syntax errors

If `npm run build` fails with JavaScript syntax errors, your Node.js version is likely too old. Verify you have version 18 or later:

```bash
node --version
```

If not, upgrade Node.js and reinstall dependencies.

## Next Steps

With installation complete, proceed to the [Quickstart](/getting-started/quickstart/) guide to learn the development workflow for editing and previewing your documentation.

> [!TIP]
> Bookmark the project folder location. You will return to it frequently when working on your documentation.
