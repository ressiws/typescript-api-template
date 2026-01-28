/**
 * @file ipGuard.middleware.ts
 * @description Global IP-based request guard (pre-auth, pre-rate-limit)
 * @version 1.0.0
 *
 * Blocks abusive traffic before authentication and token rate limiting.
 * This guard applies to ALL requests, including unauthenticated ones.
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "../core/config.js";
import { sendError } from "../core/helpers/response.helper.js";
import type { NextFunction, Request, Response } from "express";
import { normalizeIp } from "../utils/utils.js";

const ipHits = new Map<string, { count: number; reset: number }>();
let lastCleanup = 0;

export function ipGuardMiddleware(req: Request, res: Response, next: NextFunction) {
	if (!config.security.ipGuard.enable) return next();

	const ip = normalizeIp(req.ip) || "unknown";
	const now = Date.now();

	// Periodically cleanup expired entries to avoid unbounded memory growth
	if (now - lastCleanup > config.security.ipGuard.windowMs) {
		for (const [key, value] of ipHits) {
			if (value.reset < now) ipHits.delete(key);
		}
		lastCleanup = now;
	}

	const entry = ipHits.get(ip);

	if (!entry || entry.reset < now) {
		ipHits.set(ip, { count: 1, reset: now + config.security.ipGuard.windowMs });
		return next();
	}

	entry.count++;

	if (entry.count > config.security.ipGuard.maxRequests)
		return sendError(res, "IP_GUARD", 429);

	next();
}
