/**
 * @file middlewares.ts
 * @description Centralized setup for all global middlewares
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import type { Application } from "express";
import { authMiddleware } from "./security/auth.middleware.js";
import { securityHeadersMiddleware } from "./security/headers.middleware.js";
import { ipGuardMiddleware } from "./security/ipGuard.middleware.js";
import { jsonErrorMiddleware } from "./security/jsonError.middleware.js";
import { logRequestMiddleware } from "./security/logRequest.middleware.js";
import { rateLimitMiddleware } from "./security/rateLimit.middleware.js";

export function middleware(app: Application) {
	app.use(securityHeadersMiddleware);
	app.use(ipGuardMiddleware);
	app.use(logRequestMiddleware);
	app.use(jsonErrorMiddleware);
	app.use(authMiddleware);
	app.use(rateLimitMiddleware);
}
