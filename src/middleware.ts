/**
 * @file middlewares.ts
 * @description Centralized setup for all global middlewares
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import type { Application } from "express";
import { authMiddleware } from "./security/auth.middleware";
import { securityHeadersMiddleware } from "./security/headers.middleware";
import { ipGuardMiddleware } from "./security/ipGuard.middleware";
import { jsonErrorMiddleware } from "./security/jsonError.middleware";
import { logRequestMiddleware } from "./security/logRequest.middleware";
import { rateLimitMiddleware } from "./security/rateLimit.middleware";
import { validateMiddleware } from "./security/validate.middleware";

export function middleware(app: Application) {
	app.use(securityHeadersMiddleware);
	app.use(ipGuardMiddleware);
	app.use(logRequestMiddleware);
	app.use(jsonErrorMiddleware);
	app.use(validateMiddleware);
	app.use(authMiddleware);
	app.use(rateLimitMiddleware);
}
