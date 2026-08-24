import type { FastifyInstance } from "fastify";
import * as logger from "../logging/logger.js";

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

		logger.info(`${request.method} Request completed: ${request.url} with status ${reply.statusCode} in ${reply.elapsedTime}ms`);
	});
}