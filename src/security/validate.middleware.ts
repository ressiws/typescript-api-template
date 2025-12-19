/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file validate.middleware.ts
 * @description Generic request validation middleware using Zod
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "@/core/config";
import type { TokenContext } from "@/core/types";
import type { NextFunction, Request, Response } from "express";

declare global {
	namespace Express {
		interface Request {
			startTime?: number;
			token?: TokenContext;
		}
	}
}

export function validateMiddleware(req: Request, res: Response, next: NextFunction) {
	if (!config.security.validate.enable) return next();

	try {
		const routeSchema = (req.route?.stack?.[0]?.handle as any)?.schema;
		if (!routeSchema) return next();

		if (routeSchema.body) req.body = routeSchema.body.parse(req.body);
		if (routeSchema.query) req.query = routeSchema.query.parse(req.query);
		if (routeSchema.params) req.params = routeSchema.params.parse(req.params);

		return next();
	}
	catch (err: any) {
		return next(err);
	}
}