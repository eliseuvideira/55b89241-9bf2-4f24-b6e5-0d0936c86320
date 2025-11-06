import type { ChannelModel, Message } from "amqplib";
import type { Logger } from "@55b89241-9bf2-4f24-b6e5-0d0936c86320/logger";
import { sleep } from "./sleep";
import type { AppState } from "../types/AppState";

type Consumer = {
  queue: string;
  state: AppState;
  wrappedHandler: (message: Message | null) => Promise<void>;
};

export const createStop = (
  connection: ChannelModel,
  consumers: Consumer[],
  logger: Logger,
) => {
  let done = false;

  return async () => {
    if (done) {
      return;
    }
    done = true;

    logger.info("Stopping all consumers");

    await Promise.all(
      consumers.map(async ({ state }) => {
        state.isShuttingDown = true;
        if (state.consumerTag) {
          await state.channel.cancel(state.consumerTag);
        }
      }),
    );
    logger.info("All consumers cancelled");

    const totalInFlight = consumers.reduce(
      (sum, { state }) => sum + state.inFlightMessages,
      0,
    );
    logger.info("Waiting for in-flight messages", {
      inFlightMessages: totalInFlight,
    });

    while (consumers.some(({ state }) => state.inFlightMessages > 0)) {
      await sleep(100);
    }
    logger.info("All in-flight messages completed");

    await Promise.all(consumers.map(({ state }) => state.channel.close()));

    if (consumers.length > 0) {
      await connection.close();
    }

    logger.info("App stopped");
  };
};
