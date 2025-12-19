/**
 * @file rateLimit.middleware.ts
 * @description Global + token-based rate limit middleware
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "@/core/config";
import { sendError } from "@/core/helpers/response.helper";
import { logger } from "@/core/logger";
import type { NextFunction, Request, Response } from "express";

type RateEntry = { count: number; expires: number };
const rateMap = new Map<string, RateEntry>();

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
	if (!config.security.rateLimit.enable)
		return next();

	const now = Date.now();
	const windowMs = config.security.rateLimit.windowMs;
	const maxRequests = config.security.rateLimit.maxRequests;

	const key = req.token?.type === "personal" ? `token:${req.token.id}` : `ip:${req.ip}`;
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