import cors from "@fastify/cors";
import type { FastifyInstance } from "fastify";

import type { AppConfig } from "../types/config.js";

export async function registerCors(app: FastifyInstance, config: AppConfig): Promise<void> {
	await app.register(cors, {
		origin: config.env.CORS_ORIGINS,
		credentials: true,
	});
}