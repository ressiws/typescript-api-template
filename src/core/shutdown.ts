import * as logger from "../logging/logger.js";

type ShutdownHandler = () => Promise<void> | void;

export class ShutdownManager {
	private static shuttingDown = false;
	private static handlers: ShutdownHandler[] = [];

	public static register(handler: ShutdownHandler): void {
		this.handlers.push(handler);
	}

	public static registerProcessListeners(): void {
		process.once("SIGINT", () => {
			void this.shutdown("SIGINT", 0);
		});

		process.once("SIGTERM", () => {
			void this.shutdown("SIGTERM", 0);
		});

		process.once("uncaughtException", (error) => {
			logger.fatal(`Uncaught exception: ${error}`);
			process.exitCode = 1;
			void this.shutdown("uncaughtException", 1);
		});

		process.once("unhandledRejection", (reason) => {
			logger.fatal(`Unhandled promise rejection: ${reason}`);
			process.exitCode = 1;
			void this.shutdown("unhandledRejection", 1);
		});
	}

	public static async shutdown(reason: string, exitCode = 0): Promise<void> {
		if (this.shuttingDown) {
			return;
		}

		this.shuttingDown = true;

		logger.warn(`Shutdown requested: ${reason}`);

		try {
			for (const handler of this.handlers) {
				await handler();
			}

			logger.info(`Shutdown completed: ${reason}`);
		}
		catch (error) {
			logger.error(`Shutdown failed: ${error}`);
			exitCode = 1;
		}

		process.exitCode = exitCode;
	}
}