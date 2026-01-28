/**
 * @file validate.middleware.ts
 * @description Generic request validation middleware using Zod
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "../core/config.js";
import { sendError } from "../core/helpers/response.helper.js";
import { logger } from "../core/logger.js";
import type { NextFunction, Request, Response } from "express";
import { ZodError, type ZodTypeAny } from "zod";

export interface RouteSchemas {
	body?: ZodTypeAny;
	query?: ZodTypeAny;
	params?: ZodTypeAny;
}

export function validate(schema: RouteSchemas) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!config.security.validate.enable) return next();

		try {
			if (schema.body) req.body = schema.body.parse(req.body);
			if (schema.query) req.query = schema.query.parse(req.query) as typeof req.query;
			if (schema.params) req.params = schema.params.parse(req.params) as typeof req.params;

			return next();
		}
		catch (error: unknown) {
			if (error instanceof ZodError)
				logger.warn("Validation failed.", { issues: error.issues });
			else
				logger.warn(`Validation failed: ${error instanceof Error ? error.message : String(error)}`);

			return sendError(res, "VALIDATION_ERROR", 400);
		}
	};
}
