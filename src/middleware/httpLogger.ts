import type { FastifyInstance } from "fastify";
import { logger } from "../logging/logger.js";

const IGNORED_PATHS = [
	"/docs",
];

function shouldIgnore(url: string): boolean {
	return IGNORED_PATHS.some(
		(path) => url === path || url.startsWith(`${path}/`),
	);
}

export async function registerHttpLogger(app: FastifyInstance): Promise<void> {
	app.addHook("onResponse", async (request, reply) => {
		if (shouldIgnore(request.url)) {
			return;
		}

		logger.info(
			{
				category: "HTTP",
				requestId: request.id,
				method: request.method,
				url: request.url,
				statusCode: reply.statusCode,
				durationMs: reply.elapsedTime,
			},
			"Request completed",
		);
	});
}