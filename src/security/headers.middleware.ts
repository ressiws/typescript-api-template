/**
 * @file headers.middleware.ts
 * @description HTTP security headers middleware
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "@/core/config";
import type { NextFunction, Request, Response } from "express";
import helmet from "helmet";

export function securityHeadersMiddleware(req: Request, res: Response, next: NextFunction) {
	if (!config.security.headers.enable) return next();

	const helmetOptions: Parameters<typeof helmet>[0] = {
		hsts: config.env === "production" ? { maxAge: 31536000, includeSubDomains: true, preload: true } : undefined,
		frameguard: { action: "deny" },
		noSniff: true,
		referrerPolicy: { policy: "no-referrer" },
		contentSecurityPolicy: false,
	};

	helmet(helmetOptions)(req, res, () => {
		if (config.security.headers.csp) res.setHeader("Content-Security-Policy", config.security.headers.csp);
		next();
	});
}
