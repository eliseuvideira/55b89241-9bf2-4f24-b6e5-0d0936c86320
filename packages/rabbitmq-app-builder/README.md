# @55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder

RabbitMQ consumer application builder with automatic connection management and graceful shutdown.

## Features

- Declarative queue/handler definitions
- Automatic connection and channel management
- Graceful shutdown (waits for in-flight messages)
- Generic over Context type
- Supports RPC pattern with replyTo
- Automatic message parsing and error handling
- Correlation ID support

## Installation

```bash
npm install @55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder @55b89241-9bf2-4f24-b6e5-0d0936c86320/logger
# or
pnpm add @55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder @55b89241-9bf2-4f24-b6e5-0d0936c86320/logger
```

## Usage

### Basic Example

```typescript
import { AppBuilder } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder";
import { LoggerBuilder } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";
import type { Config, MessageHandler } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder";

// Define your config type
const config: Config = {
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost",
};

// Create handlers
const processOrderHandler: MessageHandler = async (content, ctx) => {
  ctx.logger.info("Processing order", { content });

  // Your business logic here
  const result = { orderId: content.id, status: "processed" };

  return result;
};

const sendEmailHandler: MessageHandler = async (content, ctx) => {
  ctx.logger.info("Sending email", { content });

  // Your business logic here

  return { sent: true };
};

// Build the app
const builder = AppBuilder((config) => [
  { queue: "orders", handler: processOrderHandler },
  { queue: "emails", handler: sendEmailHandler },
]);

const logger = await LoggerBuilder.build(process.env);
const app = await builder.build(config, logger);

// Run the app
await app.run();

// Graceful shutdown
process.on("SIGINT", async () => {
  await app.stop();
  process.exit(0);
});
```

### With Custom Context

```typescript
import type { Logger } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";

// Define custom context
type MyContext = {
  logger: Logger;
  db: DatabaseConnection;
  cache: RedisClient;
};

const handler: MessageHandler<MyContext> = async (content, ctx) => {
  // ctx has type MyContext and includes logger, db, cache
  const user = await ctx.db.users.findOne({ id: content.userId });
  ctx.logger.info("Found user", { user });
  return user;
};

// Note: The AppBuilder is generic but the context type is enforced in the handler
// You'll need to cast the context in the handler or manage context creation yourself
```

### Error Handling

Errors are automatically caught and logged. If the message has a `replyTo` property, an error reply is sent back:

```typescript
const handler: MessageHandler = async (content, ctx) => {
  if (!content.email) {
    throw new Error("Email is required");
  }

  // This error will be caught, logged, and sent as a reply if replyTo is set
  // The message will be nack'd without requeue
};
```

### RPC Pattern

The builder automatically supports RPC:

```typescript
// Consumer side (already handled by AppBuilder)
const handler: MessageHandler = async (content, ctx) => {
  return { result: "computed value" };
};

// If the message has correlationId and replyTo, the result
// will be sent back automatically
```

## API

### AppBuilder

```typescript
AppBuilder<Context>(
  define: (config: Config) => Array<{
    queue: string;
    handler: MessageHandler<Context>;
  }>
)
```

Returns a builder with a `build` method.

### builder.build(config, logger)

```typescript
build(config: Config, logger: Logger): Promise<App>
```

Creates the app with all queue consumers ready.

### App

```typescript
type App = {
  run: () => Promise<void>;
  stop: () => Promise<void>;
};
```

- `run()`: Start consuming messages from all queues
- `stop()`: Gracefully shutdown (cancel consumers, wait for in-flight messages, close connections)

### MessageHandler

```typescript
type MessageHandler<Context extends { logger: Logger }> = (
  content: unknown,
  ctx: Context
) => Promise<unknown>;
```

## Type Exports

```typescript
import type {
  App,
  Config,
  MessageHandler,
  SuccessReply,
  ErrorReply,
} from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/rabbitmq-app-builder";
```

## How It Works

1. AppBuilder takes a function that returns queue/handler definitions
2. On `build()`, it connects to RabbitMQ and creates channels for each queue
3. Each handler is wrapped with message handling logic (parsing, logging, error handling)
4. On `run()`, it starts consuming messages
5. On `stop()`, it:
   - Sets shutdown flag (new messages are requeued)
   - Cancels all consumers
   - Waits for in-flight messages to complete
   - Closes all channels and connection
