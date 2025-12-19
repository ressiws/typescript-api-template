/**
 * @file headers.middleware.ts
 * @description HTTP security headers middleware
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "@/core/config";
import type { NextFunction, Request, Response } from "express";

export function securityHeadersMiddleware(_req: Request, res: Response, next: NextFunction) {
	if (!config.security.headers.enable)
		return next();

	// Clickjacking
	res.setHeader("X-Frame-Options", "DENY");

	// MIME sniffing
	res.setHeader("X-Content-Type-Options", "nosniff");

	// Referrer
	res.setHeader("Referrer-Policy", "no-referrer");

	// HTTPS only (prod)
	if (config.env === "production") {
		res.setHeader(
			"Strict-Transport-Security",
			"max-age=31536000; includeSubDomains; preload"
		);
	}

	// CSP
	if (config.security.headers.csp)
		res.setHeader("Content-Security-Policy", config.security.headers.csp);

	next();
}
