import rateLimit from "@fastify/rate-limit";
import type { FastifyInstance } from "fastify";

import type { AppConfig } from "../types/config.js";

export async function registerRateLimit(app: FastifyInstance, config: AppConfig): Promise<void> {
	await app.register(rateLimit, {
		max: config.rateLimit.max,
		timeWindow: config.rateLimit.windowMs,
		enableDraftSpec: true,

		allowList: (request) => {
			return request.url.startsWith("/docs");
		},
	});
}