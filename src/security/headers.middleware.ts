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
		// Prevent clickjacking
		frameguard: { action: "deny" },

		// Prevent MIME type sniffing
		noSniff: true,

		// Strict Transport Security
		hsts: config.env === "production" ? { maxAge: 31536000, includeSubDomains: true, preload: true } : undefined,

		// Referrer Policy
		referrerPolicy: { policy: "no-referrer" },

		contentSecurityPolicy: {
			directives: {
				defaultSrc: ["'self'"],
				scriptSrc: ["'self'"],
				styleSrc: ["'self'"],
				imgSrc: ["'self'"],
				connectSrc: ["'self'"],
				fontSrc: ["'self'"],
				objectSrc: ["'none'"],
				mediaSrc: ["'self'"],
				frameAncestors: ["'none'"],
				baseUri: ["'self'"],
				formAction: ["'self'"],
			},
		},
	};

	helmet(helmetOptions)(req, res, next);
}
