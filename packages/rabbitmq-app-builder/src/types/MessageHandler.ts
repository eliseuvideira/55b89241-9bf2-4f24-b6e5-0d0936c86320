import type { Logger } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";

export type MessageHandler<
  Context extends { logger: Logger } = { logger: Logger },
> = (content: unknown, ctx: Context) => Promise<unknown>;
