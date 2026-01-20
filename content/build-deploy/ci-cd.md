---
title: CI/CD Integration
description: Set up automated builds and deployments for your MarkStack site using GitHub Actions, GitLab CI, and other continuous integration systems.
---

# CI/CD Integration

Continuous Integration and Continuous Deployment (CI/CD) automates building and deploying your MarkStack site whenever you push changes. This guide covers setting up automated pipelines for popular platforms.

## Benefits of CI/CD

Automated deployments provide several advantages:

- **Consistency**: Every build uses the same environment and steps
- **Speed**: Deploy seconds after pushing, no manual steps
- **Reliability**: Catch build errors before they reach production
- **Collaboration**: Team members can contribute without deployment access
- **Audit trail**: Git history shows what was deployed and when

## GitHub Actions

GitHub Actions is integrated directly into GitHub and requires no additional services.

### Basic Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/
          retention-days: 7
```

This workflow:
- Runs on every push to main
- Runs on pull requests (for testing)
- Can be triggered manually
- Caches npm dependencies for faster builds
- Uploads the built site as an artifact

### Deploy to GitHub Pages

For GitHub Pages deployment, use this workflow:

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

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Configure Pages
        uses: actions/configure-pages@v4

      - name: Upload Pages artifact
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

After adding this workflow:
1. Go to repository Settings
2. Navigate to Pages
3. Under "Build and deployment", select "GitHub Actions"

### Deploy to Netlify

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: './dist'
          production-branch: main
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

To get the required secrets:
1. **NETLIFY_AUTH_TOKEN**: Create at Netlify User Settings under Applications
2. **NETLIFY_SITE_ID**: Found in Site Configuration under General

Add these as repository secrets in GitHub Settings.

### Deploy to Vercel

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./dist
          vercel-args: '--prod'
```

### Pull Request Previews

Deploy preview versions for pull requests:

```yaml
name: Deploy Preview

on:
  pull_request:
    types: [opened, synchronize, reopened]

jobs:
  preview:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Deploy Preview to Netlify
        uses: nwtgck/actions-netlify@v3
        with:
          publish-dir: './dist'
          production-deploy: false
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: 'PR Preview: ${{ github.event.pull_request.title }}'
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

This posts a comment on the PR with a link to the preview deployment.

## GitLab CI

GitLab CI uses a `.gitlab-ci.yml` file in your repository root.

### Basic Pipeline

```yaml
image: node:20-alpine

stages:
  - build
  - deploy

cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 week

pages:
  stage: deploy
  script:
    - mv dist public
  artifacts:
    paths:
      - public
  only:
    - main
```

This deploys to GitLab Pages. The site will be at `https://username.gitlab.io/repository-name/`.

### Deploy to External Host

```yaml
image: node:20-alpine

stages:
  - build
  - deploy

build:
  stage: build
  script:
    - npm ci
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 day

deploy_production:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache rsync openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | tr -d '\r' | ssh-add -
    - mkdir -p ~/.ssh
    - chmod 700 ~/.ssh
    - echo "$SSH_KNOWN_HOSTS" >> ~/.ssh/known_hosts
  script:
    - rsync -avz --delete dist/ $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH
  only:
    - main
  environment:
    name: production
    url: https://docs.yoursite.com
```

Required CI/CD variables:
- `SSH_PRIVATE_KEY`: Private key for server access
- `SSH_KNOWN_HOSTS`: Server's SSH host key
- `DEPLOY_USER`: SSH username
- `DEPLOY_HOST`: Server hostname
- `DEPLOY_PATH`: Target directory on server

## Azure DevOps Pipelines

Create `azure-pipelines.yml`:

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'
    displayName: 'Install Node.js'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npm run build
    displayName: 'Build site'

  - task: PublishBuildArtifacts@1
    inputs:
      pathToPublish: 'dist'
      artifactName: 'site'
    displayName: 'Publish artifact'
```

### Deploy to Azure Static Web Apps

```yaml
trigger:
  branches:
    include:
      - main

pool:
  vmImage: 'ubuntu-latest'

steps:
  - task: NodeTool@0
    inputs:
      versionSpec: '20.x'

  - script: npm ci
    displayName: 'Install dependencies'

  - script: npm run build
    displayName: 'Build site'

  - task: AzureStaticWebApp@0
    inputs:
      app_location: '/'
      output_location: 'dist'
    env:
      azure_static_web_apps_api_token: $(AZURE_STATIC_WEB_APPS_API_TOKEN)
```

## CircleCI

Create `.circleci/config.yml`:

```yaml
version: 2.1

executors:
  node-executor:
    docker:
      - image: cimg/node:20.0

jobs:
  build:
    executor: node-executor
    steps:
      - checkout
      - restore_cache:
          keys:
            - npm-deps-{{ checksum "package-lock.json" }}
            - npm-deps-
      - run:
          name: Install dependencies
          command: npm ci
      - save_cache:
          key: npm-deps-{{ checksum "package-lock.json" }}
          paths:
            - node_modules
      - run:
          name: Build site
          command: npm run build
      - persist_to_workspace:
          root: .
          paths:
            - dist

  deploy:
    executor: node-executor
    steps:
      - attach_workspace:
          at: .
      - run:
          name: Deploy to hosting
          command: |
            # Add your deployment commands here
            echo "Deploying dist/ folder"

workflows:
  build-and-deploy:
    jobs:
      - build
      - deploy:
          requires:
            - build
          filters:
            branches:
              only: main
```

## Build Caching

Caching dependencies speeds up CI builds significantly.

### npm Cache

Most CI systems support caching `node_modules`:

**GitHub Actions:**
```yaml
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
```

**GitLab CI:**
```yaml
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - node_modules/
```

**CircleCI:**
```yaml
- restore_cache:
    keys:
      - npm-deps-{{ checksum "package-lock.json" }}
```

## Environment Variables

Store sensitive values as secrets, not in your repository.

### Common Secrets

| Secret | Purpose |
|--------|---------|
| `NETLIFY_AUTH_TOKEN` | Netlify API authentication |
| `NETLIFY_SITE_ID` | Target Netlify site |
| `VERCEL_TOKEN` | Vercel API authentication |
| `SSH_PRIVATE_KEY` | Server access for self-hosting |

### Adding Secrets

**GitHub:**
Settings > Secrets and variables > Actions > New repository secret

**GitLab:**
Settings > CI/CD > Variables

**CircleCI:**
Project Settings > Environment Variables

## Build Notifications

### Slack Notifications

Add to your GitHub Actions workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    fields: repo,message,commit,author,action,eventName,ref,workflow
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Email Notifications

Most CI platforms send email notifications by default for failed builds. Check platform settings to configure.

## Troubleshooting CI Builds

### Build Fails in CI but Works Locally

Common causes:
1. **Missing dependencies**: Ensure `package-lock.json` is committed
2. **Node version mismatch**: Specify exact version in CI
3. **Case sensitivity**: Linux is case-sensitive, Windows/Mac are not
4. **Missing files**: Check `.gitignore` is not excluding needed files

### Slow Builds

Improve build speed:
1. Enable dependency caching
2. Use `npm ci` instead of `npm install`
3. Use lightweight base images
4. Avoid unnecessary steps

### Debug CI Issues

Add debug output:

```yaml
- name: Debug info
  run: |
    node --version
    npm --version
    ls -la
    cat package.json
```

> [!TIP]
> Most CI platforms allow re-running failed jobs with SSH access for debugging. Check your platform's documentation for this feature.
