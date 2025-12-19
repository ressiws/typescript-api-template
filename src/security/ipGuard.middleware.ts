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

import { config } from "@/core/config";
import type { NextFunction, Request, Response } from "express";

const ipHits = new Map<string, { count: number; reset: number }>();

export function ipGuardMiddleware(req: Request, res: Response, next: NextFunction) {
	if (!config.security.ipGuard.enable) return next();

	const ip = req.ip;
	const now = Date.now();

	const entry = ipHits.get(ip || "");

	if (!entry || entry.reset < now) {
		ipHits.set(ip || "", { count: 1, reset: now + config.security.ipGuard.windowMs });
		return next();
	}

	entry.count++;

	if (entry.count > config.security.ipGuard.maxRequests)
		return res.status(429).json({ error: "Too many requests" });

	next();
}