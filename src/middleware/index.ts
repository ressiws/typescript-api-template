import type { FastifyInstance } from "fastify";
import type { AppConfig } from "../types/config.js";

import { registerCompression } from "./compression.js";
import { registerCors } from "./cors.js";
import { registerErrorHandler } from "./errorHandler.js";
import { registerHeaders } from "./headers.js";
import { registerHttpLogger } from "./httpLogger.js";
import { registerRateLimit } from "./rateLimit.js";
import { registerRequestId } from "./requestId.js";
import { registerSwagger } from "./swagger.js";

export async function registerMiddleware(app: FastifyInstance, config: AppConfig): Promise<void> {
	await registerCors(app, config);
	await registerHeaders(app);
	await registerRateLimit(app, config);
	await registerRequestId(app);
	await registerHttpLogger(app);
	await registerCompression(app);
	await registerErrorHandler(app);
	await registerSwagger(app);
}