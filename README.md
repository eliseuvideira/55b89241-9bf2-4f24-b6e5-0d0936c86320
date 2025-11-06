# Reusable Packages Monorepo

A collection of simple, focused packages extracted for reuse.

## Packages

- `@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger` - Pino logger wrapper with consistent signature
- `@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder` - RabbitMQ consumer application builder

## Setup

```bash
pnpm install
pnpm build
```

## Development

Build all packages:
```bash
pnpm build
```

Watch mode for development:
```bash
pnpm dev
```

## Versioning

This monorepo uses changesets for version management.

Create a changeset:
```bash
pnpm changeset
```

Version packages:
```bash
pnpm version-packages
```

Publish to npm:
```bash
pnpm release
```

## Publishing

Before publishing, update the scope in all package.json files from `@55b89241-9bf2-4f24-b6e5-0d0936c86320` to your actual npm scope (e.g., `@your-username` or `@your-org`).

Then:
1. Create a changeset: `pnpm changeset`
2. Version packages: `pnpm version-packages`
3. Publish: `pnpm release`
