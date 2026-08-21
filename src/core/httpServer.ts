import type { FastifyInstance } from "fastify";
import { config } from "../config/index.js";
import { logger } from "../logging/logger.js";

export class HttpServer {
	constructor(private readonly app: FastifyInstance) { }

	public async start(): Promise<void> {
		const { PORT, HOST } = config.env;

		try {
			await this.app.listen({
				port: PORT,
				host: HOST,
			});
		} catch (error) {
			logger.error(
				{
					category: "SYSTEM",
					err: error,
					port: PORT,
					host: HOST,
				},
				"HTTP server failed to start",
			);

			throw error;
		}
	}

	public async stop(): Promise<void> {
		try {
			await this.app.close();

			logger.info(
				{
					category: "SYSTEM",
				},
				"HTTP server stopped",
			);
		}
		catch (error) {
			logger.error(
				{
					category: "SYSTEM",
					err: error,
				},
				"HTTP server failed to stop",
			);

			throw error;
		}
	}

	public getInstance(): FastifyInstance {
		return this.app;
	}
}