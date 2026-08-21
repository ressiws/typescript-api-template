import Fastify, { type FastifyInstance } from "fastify";
import { config } from "./config/index.js";
import { loadRoutes } from "./loaders/routeLoader.js";
import { registerMiddleware } from "./middleware/index.js";

export async function createApp(): Promise<FastifyInstance> {
	const app = Fastify({
		logger: false,

		connectionTimeout: 10_000,
		keepAliveTimeout: 72_000,
		requestTimeout: 30_000,

		routerOptions: {
			ignoreTrailingSlash: true,
			ignoreDuplicateSlashes: true
		},

		bodyLimit: 1_048_576, // 1 MB

		requestIdHeader: "x-request-id",
	});

	await registerMiddleware(app, config);
	await loadRoutes(app);

	return app;
}