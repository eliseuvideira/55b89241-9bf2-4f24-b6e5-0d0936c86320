import type { Message } from "amqplib";
import type { Logger } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";
import type { AppState } from "../types/AppState";

type Consumer = {
  queue: string;
  state: AppState;
  wrappedHandler: (message: Message | null) => Promise<void>;
};

export const createRun = (consumers: Consumer[], logger: Logger) => {
  return async () => {
    await Promise.all(
      consumers.map(async ({ queue, state, wrappedHandler }) => {
        const consumeResult = await state.channel.consume(queue, wrappedHandler);
        state.consumerTag = consumeResult.consumerTag;
        logger.info("Listening on queue", { queue });
      }),
    );
  };
};
