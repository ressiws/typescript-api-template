/**
 * @file auth.middleware.ts
 * @description Token-based auth middleware
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "../core/config.js";
import { sendError } from "../core/helpers/response.helper.js";
import { logger } from "../core/logger.js";
import type { TokenContext } from "../core/types/index.js";
import { getUnixTimestamp, normalizeIp } from "../utils/utils.js";
import type { NextFunction, Request, Response } from "express";
import { validateToken } from "../core/services/token.service.js";

declare global {
	namespace Express {
		interface Request {
			token?: TokenContext;
		}
	}
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
	if (!config.security.auth.enable) return next();

	const ip = normalizeIp(req.ip ?? req.socket.remoteAddress);
	const authHeader = req.headers.authorization;

	if (!authHeader) {
		logger.warn(`No token provided. IP: ${ip}`);
		return sendError(res, "NO_TOKEN", 401);
	}

	const tokenValue = authHeader.replace(/^Bearer\s+/i, "").trim();
	const token = validateToken(tokenValue);

	if (!token) {
		logger.warn(`Invalid token attempt. IP: ${ip}`);
		return sendError(res, "UNAUTHORIZED", 403);
	}

	if (!token.allowedIps.includes(ip)) {
		logger.warn(`Unauthorized access from IP: ${ip}, token ID: ${token.id}`);
		return sendError(res, "UNAUTHORIZED", 403);
	}

	if (token.expiresAt && token.expiresAt <= getUnixTimestamp()) {
		logger.warn(`Expired token access. Token ID: ${token.id}, IP: ${ip}`);
		return sendError(res, "EXPIRED_TOKEN", 403);
	}

	req.token = token;
	logger.debug(`[AUTH] Token validated. ID: ${token.id}, Type: ${token.type}, IP: ${ip}, Route: ${req.path}`);
	return next();
}
