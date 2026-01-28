/**
 * @file rateLimit.middleware.ts
 * @description Global + token-based rate limit middleware
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "../core/config.js";
import { sendError } from "../core/helpers/response.helper.js";
import { logger } from "../core/logger.js";
import type { NextFunction, Request, Response } from "express";
import { normalizeIp } from "../utils/utils.js";

type RateEntry = { count: number; expires: number };
const rateMap = new Map<string, RateEntry>();
let lastCleanup = 0;

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
	if (!config.security.rateLimit.enable)
		return next();

	const now = Date.now();
	const windowMs = config.security.rateLimit.windowMs;
	const maxRequests = config.security.rateLimit.maxRequests;

	// Periodically cleanup expired entries to avoid unbounded memory growth
	if (now - lastCleanup > windowMs) {
		for (const [key, value] of rateMap) {
			if (value.expires < now) rateMap.delete(key);
		}
		lastCleanup = now;
	}

	const ip = normalizeIp(req.ip) || "unknown";
	const key = req.token ? `token:${req.token.id}` : `ip:${ip}`;
	const max = req.token?.maxRequests ?? maxRequests;
	const entry = rateMap.get(key);

	if (!entry || now > entry.expires) {
		rateMap.set(key, { count: 1, expires: now + windowMs });
		logger.debug(`Rate limit reset for ${key}. Max: ${max}, Window: ${windowMs}s`);
		return next();
	}

	if (entry.count >= max) {
		logger.warn(`Rate limit exceeded: ${key}, count: ${entry.count}, max: ${max}`);
		return sendError(res, "RATE_LIMIT", 429);
	}

	entry.count++;
	logger.debug(`Rate key: ${key}, current count: ${entry?.count ?? 0}, expires: ${entry?.expires ?? "none"}`);
	return next();
}
