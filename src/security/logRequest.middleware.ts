/**
 * @file logRequest.middleware.ts
 * @description Middleware to log all incoming requests with token info, status and duration
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { logger } from "../core/logger.js";
import type { TokenContext } from "../core/types/index.js";
import type { NextFunction, Request, Response } from "express";

declare global {
	namespace Express {
		interface Request {
			token?: TokenContext;
			startTime?: number;
		}
	}
}

export function logRequestMiddleware(req: Request, res: Response, next: NextFunction) {
	const start = process.hrtime.bigint();

	res.on("finish", () => {
		const duration = Number(process.hrtime.bigint() - start) / 1_000_000;
		const tokenInfo = req.token ? `TokenID:${req.token.id} Type:${req.token.type}` : "NoToken";

		logger.info(`[REQ] ${req.method} ${req.originalUrl} | Status: ${res.statusCode} | ${tokenInfo} | Duration: ${duration.toFixed(2)}ms`);
	});

	next();
}
