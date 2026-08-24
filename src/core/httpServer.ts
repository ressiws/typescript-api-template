import type { FastifyInstance } from "fastify";
import { config } from "../config/index.js";
import * as logger from "../logging/logger.js";

export class HttpServer {
	constructor(private readonly app: FastifyInstance) { }

	public async start(): Promise<void> {
		const { PORT, HOST } = config.env;

		try {
			await this.app.listen({
				port: PORT,
				host: HOST,
			});
		}
		catch (error) {
			logger.error(`HTTP server failed to start (${HOST}:${PORT}): ${error instanceof Error ? error.message : String(error)}`);
			throw error;
		}
	}

	public async stop(): Promise<void> {
		try {
			await this.app.close();
			logger.info("HTTP server stopped");
		}
		catch (error) {
			logger.error(`HTTP server failed to stop: ${error instanceof Error ? error.message : String(error)}`);
			throw error;
		}
	}

	public getInstance(): FastifyInstance {
		return this.app;
	}
}