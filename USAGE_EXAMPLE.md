# Usage Example

This document shows how to use these packages in your application.

## Setup

1. Install the packages:

```bash
pnpm add @55b89241-9bf2-4f24-b6e5-0d0936c86320/logger @55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder
```

2. Create your application:

```typescript
// config.ts
import { z } from "zod";

const schema = z.object({
  RABBITMQ_URL: z.string(),
  NODE_ENV: z.string().default("production"),
  LOG_LEVEL: z.string().default("info"),
});

export const config = schema.parse(process.env);
export type Config = z.infer<typeof schema>;
```

```typescript
// handlers.ts
import type { MessageHandler } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder";

export const processOrderHandler: MessageHandler = async (content, ctx) => {
  ctx.logger.info("Processing order", { content });

  // Simulate work
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return { orderId: content.id, status: "processed" };
};

export const sendEmailHandler: MessageHandler = async (content, ctx) => {
  ctx.logger.info("Sending email", { content });

  // Simulate work
  await new Promise((resolve) => setTimeout(resolve, 500));

  return { sent: true, to: content.email };
};
```

```typescript
// app.ts
import { AppBuilder } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder";
import { processOrderHandler, sendEmailHandler } from "./handlers";
import type { Config } from "./config";

export const createApp = AppBuilder<{ logger: Logger }>((config: Config) => [
  { queue: "orders", handler: processOrderHandler },
  { queue: "emails", handler: sendEmailHandler },
]);
```

```typescript
// main.ts
import { LoggerBuilder } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";
import { config } from "./config";
import { createApp } from "./app";

const main = async () => {
  const logger = await LoggerBuilder.build(process.env);

  logger.info("Starting application");

  const app = await createApp.build(config, logger);

  await app.run();

  logger.info("Application started");

  // Graceful shutdown
  const shutdown = async () => {
    logger.info("Received shutdown signal");
    await app.stop();
    logger.info("Application stopped");
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

main().catch((error) => {
  console.error("Failed to start application", error);
  process.exit(1);
});
```

## With Custom Context

If you need to pass additional dependencies to your handlers:

```typescript
// types/Context.ts
import type { Logger } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";

export type Context = {
  logger: Logger;
  db: DatabaseConnection;
  cache: RedisClient;
};
```

```typescript
// handlers.ts
import type { MessageHandler } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder";
import type { Context } from "./types/Context";

export const getUserHandler: MessageHandler<Context> = async (content, ctx) => {
  ctx.logger.info("Getting user", { content });

  const user = await ctx.db.users.findOne({ id: content.userId });

  // Check cache
  const cached = await ctx.cache.get(`user:${content.userId}`);
  if (cached) {
    ctx.logger.info("Cache hit");
    return JSON.parse(cached);
  }

  // Store in cache
  await ctx.cache.set(`user:${content.userId}`, JSON.stringify(user));

  return user;
};
```

Note: The current implementation of AppBuilder creates a minimal context with just the logger. If you need a custom context with additional dependencies, you'll need to modify how the context is created in the `withMessageHandling` function, or create a wrapper around the AppBuilder.

## Project Structure

```
your-app/
├── src/
│   ├── main.ts           # Entry point
│   ├── app.ts            # App builder configuration
│   ├── config.ts         # Configuration
│   ├── handlers.ts       # Message handlers
│   └── types/
│       └── Context.ts    # Custom context type
├── package.json
└── tsconfig.json
```

## package.json

```json
{
  "name": "your-app",
  "version": "1.0.0",
  "scripts": {
    "build": "tsc",
    "start": "node dist/main.js",
    "dev": "ts-node src/main.ts"
  },
  "dependencies": {
    "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger": "^0.1.0",
    "@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder": "^0.1.0",
    "zod": "^4.1.12",
    "dotenv": "^17.2.3"
  },
  "devDependencies": {
    "@types/node": "^24.10.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.9.3"
  }
}
```

## .env

```
RABBITMQ_URL=amqp://localhost
NODE_ENV=development
LOG_LEVEL=info
```

## Building and Running

```bash
# Development
pnpm dev

# Production
pnpm build
pnpm start
```
