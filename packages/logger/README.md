# @55b89241-9bf2-4f24-b6e5-0d0936c86320/logger

Simple pino logger wrapper with consistent signature: `logger.info("message", { data })`

## Features

- Consistent signature: message first, data second
- Auto-serializes `error` key using pino's standard serializer
- Supports child loggers with bindings
- Automatic pretty printing in development
- All standard pino log levels: info, warn, error, fatal, debug, trace

## Installation

```bash
npm install @55b89241-9bf2-4f24-b6e5-0d0936c86320/logger
# or
pnpm add @55b89241-9bf2-4f24-b6e5-0d0936c86320/logger
```

## Usage

```typescript
import { LoggerBuilder } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";

const logger = await LoggerBuilder.build(process.env);

// Simple message
logger.info("Server started");

// Message with data
logger.info("User logged in", { userId: 123 });

// Error logging (automatically serialized)
try {
  throw new Error("Something went wrong");
} catch (error) {
  logger.error("Failed to process request", { error });
}

// Child logger with bindings
const requestLogger = logger.child({ requestId: "abc-123" });
requestLogger.info("Processing request");
// Output: {"level":30,"time":...,"requestId":"abc-123","msg":"Processing request"}
```

## Configuration

The logger respects the following environment variables:

- `NODE_ENV`: When set to "development", enables pretty printing
- `LOG_LEVEL`: Sets the minimum log level (info, warn, error, fatal, debug, trace). Defaults to "info"

## Type Exports

```typescript
import type { Logger } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";

function someFunction(logger: Logger) {
  logger.info("Hello");
}
```
