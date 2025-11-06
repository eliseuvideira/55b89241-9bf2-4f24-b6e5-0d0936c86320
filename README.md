# Reusable Packages Monorepo

A collection of simple, focused packages for building RabbitMQ consumers with clean logging.

## Packages

- **`@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger`** - Pino logger wrapper with consistent signature
- **`@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder`** - RabbitMQ consumer application builder with graceful shutdown

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run in watch mode during development
pnpm dev
```

## Development Workflow

### Making Changes

1. Create a feature branch
2. Make your changes
3. Create a changeset: `pnpm changeset`
4. Commit and push
5. Create a PR

### Publishing (Automated via GitHub Actions)

When you merge a PR with changesets:

1. GitHub Action creates a "Version Packages" PR
2. Review and merge the Version PR
3. Packages are automatically published to npm

See [SETUP.md](./SETUP.md) for complete setup and workflow documentation.

## Project Structure

```
packages/
├── logger/              # Logger package
└── rabbitmq-app-builder/  # RabbitMQ builder package
```

## Tech Stack

- **Turborepo** - Monorepo build system with caching
- **Changesets** - Version management and changelog generation
- **pnpm** - Fast, disk-space efficient package manager
- **TypeScript** - Type-safe development

## First Time Setup

1. Replace `@55b89241-9bf2-4f24-b6e5-0d0936c86320` with your npm scope
2. Set up GitHub repository
3. Add `NPM_TOKEN` to GitHub Secrets
4. Install Changesets bot (optional)

See [SETUP.md](./SETUP.md) for detailed instructions.

## Documentation

- [SETUP.md](./SETUP.md) - Complete setup and workflow guide
- [WORKFLOW.md](./WORKFLOW.md) - Visual workflow from code to publish
- [CHANGESET_ENFORCEMENT.md](./CHANGESET_ENFORCEMENT.md) - How to enforce changesets on PRs
- [USAGE_EXAMPLE.md](./USAGE_EXAMPLE.md) - How to use these packages in your app
- [packages/logger/README.md](./packages/logger/README.md) - Logger package docs
- [packages/rabbitmq-app-builder/README.md](./packages/rabbitmq-app-builder/README.md) - RabbitMQ builder docs
