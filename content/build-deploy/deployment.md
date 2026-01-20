---
title: Deployment Guide
description: Deploy your MarkStack site to Netlify, Vercel, GitHub Pages, Cloudflare Pages, or self-host with nginx and Apache.
---

# Deployment Guide

MarkStack generates a static site that can be deployed anywhere static files are served. This guide covers deployment to popular platforms and self-hosting options.

## Pre-Deployment Checklist

Before deploying, verify your site is ready:

- [ ] Site builds without errors: `npm run build`
- [ ] All pages render correctly in local preview
- [ ] Search functionality works
- [ ] Navigation is correct
- [ ] `siteconfig.json` has the correct `siteUrl` for production
- [ ] Images and links work

### Update Site URL

Edit `siteconfig.json` and set the production URL:

```json
{
  "siteUrl": "https://docs.yoursite.com"
}
```

This URL is used in OpenGraph meta tags for social sharing. Rebuild after changing.

## Netlify

Netlify offers free hosting for static sites with automatic deployments from Git.

### Deploy from Git (Recommended)

1. Push your project to GitHub, GitLab, or Bitbucket
2. Sign in to [Netlify](https://app.netlify.com/)
3. Click "Add new site" and select "Import an existing project"
4. Connect your Git provider and select your repository
5. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
6. Click "Deploy site"

Netlify will build and deploy automatically on every push to your main branch.

### Create netlify.toml

For consistent builds, add a `netlify.toml` file to your project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

# Redirect rules for clean URLs
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

### Manual Deploy with CLI

For one-time deploys without Git:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build your site
npm run build

# Deploy to production
netlify deploy --prod --dir=dist
```

### Custom Domain

1. Go to Site settings in Netlify
2. Click "Domain management"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Enable HTTPS (automatic with Let's Encrypt)

## Vercel

Vercel provides fast global hosting with Git integration.

### Deploy from Git

1. Push your project to GitHub, GitLab, or Bitbucket
2. Sign in to [Vercel](https://vercel.com/)
3. Click "Add New Project"
4. Import your repository
5. Configure settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click "Deploy"

### Create vercel.json

Add a `vercel.json` file for configuration:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "routes": [
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/404.html", "status": 404 }
  ]
}
```

### Manual Deploy with CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Build
npm run build

# Deploy (follow prompts)
vercel --prod
```

## GitHub Pages

GitHub Pages hosts static sites directly from your repository.

### Using GitHub Actions (Recommended)

1. Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

2. In your repository settings, go to Pages
3. Under "Build and deployment", select "GitHub Actions"
4. Push to main branch to trigger deployment

### GitHub Pages URL

Your site will be available at:

- Organization/user site: `https://username.github.io/`
- Project site: `https://username.github.io/repository-name/`

For project sites, you may need to update base URLs in your config.

## Cloudflare Pages

Cloudflare Pages offers fast global hosting with Git integration.

### Deploy from Git

1. Sign in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to Workers and Pages
3. Click "Create application" then "Pages"
4. Connect to Git and select your repository
5. Configure build settings:
   - **Framework preset**: None
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
6. Click "Save and Deploy"

### Create wrangler.toml

For Cloudflare-specific configuration:

```toml
name = "your-site-name"
pages_build_output_dir = "dist"
```

## Self-Hosting

For complete control, host the static files yourself.

### nginx Configuration

```nginx
server {
    listen 80;
    server_name docs.yoursite.com;
    
    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name docs.yoursite.com;
    
    # SSL certificates (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/docs.yoursite.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/docs.yoursite.com/privkey.pem;
    
    root /var/www/docs.yoursite.com;
    index index.html;
    
    # Clean URLs
    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }
    
    # Custom 404 page
    error_page 404 /404.html;
    
    # Cache static assets
    location ~* \.(css|js|svg|png|jpg|jpeg|gif|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Security headers
    add_header X-Content-Type-Options nosniff;
    add_header X-Frame-Options DENY;
    add_header X-XSS-Protection "1; mode=block";
}
```

### Apache Configuration

Create a `.htaccess` file in your document root:

```apache
# Enable rewrite engine
RewriteEngine On

# Redirect HTTP to HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Clean URLs
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*)$ $1/index.html [L]

# Custom 404
ErrorDocument 404 /404.html

# Cache static assets
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "DENY"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
```

### Caddy Configuration

Caddy provides automatic HTTPS:

```
docs.yoursite.com {
    root * /var/www/docs.yoursite.com
    file_server
    
    # Clean URLs
    try_files {path} {path}/ {path}/index.html
    
    # Custom 404
    handle_errors {
        rewrite * /404.html
        file_server
    }
    
    # Cache headers
    @static {
        path *.css *.js *.svg *.png *.jpg *.jpeg *.gif *.woff2
    }
    header @static Cache-Control "public, max-age=31536000, immutable"
}
```

### Deploying to Self-Hosted Server

```bash
# Build locally
npm run build

# Copy to server (example using rsync)
rsync -avz --delete dist/ user@server:/var/www/docs.yoursite.com/

# Or using SCP
scp -r dist/* user@server:/var/www/docs.yoursite.com/
```

## Docker Deployment

### Create Dockerfile

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Create nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ $uri/index.html =404;
    }
    
    error_page 404 /404.html;
}
```

### Build and Run

```bash
docker build -t markstack-docs .
docker run -p 8080:80 markstack-docs
```

## CDN Configuration

For better performance, serve assets through a CDN:

### Recommended CDN Settings

| Asset Type | Cache Duration |
|------------|----------------|
| HTML files | 1 hour or less |
| CSS files | 1 year |
| JavaScript | 1 year |
| Images | 1 year |
| Fonts | 1 year |

### Cache Invalidation

Since MarkStack rebuilds everything on each build, use cache-busting only for HTML. CSS and JS can be cached long-term because they do not change frequently.

## Performance Optimization

### Compression

Enable gzip or brotli compression on your server:

**nginx:**
```nginx
gzip on;
gzip_types text/html text/css application/javascript application/json image/svg+xml;
```

**Apache:**
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript application/json image/svg+xml
</IfModule>
```

### HTTP/2

Enable HTTP/2 for parallel asset loading:

- Netlify, Vercel, Cloudflare: Enabled by default
- nginx: `listen 443 ssl http2;`
- Apache: `Protocols h2 http/1.1`

## Post-Deployment Verification

After deploying, verify:

- [ ] Homepage loads correctly
- [ ] Navigation works on all pages
- [ ] Search returns results
- [ ] Theme toggle works
- [ ] Code blocks display correctly
- [ ] External links open correctly
- [ ] 404 page shows for invalid URLs
- [ ] HTTPS is working (no mixed content warnings)

> [!TIP]
> Use browser developer tools to check for console errors and network issues after deployment.
