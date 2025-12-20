/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file validate.middleware.ts
 * @description Generic request validation middleware using Zod
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "@/core/config";
import { sendError } from "@/core/helpers/response.helper";
import { logger } from "@/core/logger";
import type { NextFunction, Request, Response } from "express";
import type { ZodSchema } from "zod";

export interface RouteSchemas {
	body?: ZodSchema<any>;
	query?: ZodSchema<any>;
	params?: ZodSchema<any>;
}

export function validate(schema: RouteSchemas) {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!config.security.validate.enable) return next();

		try {
			if (schema.body) req.body = schema.body.parse(req.body);
			if (schema.query) req.query = schema.query.parse(req.query);
			if (schema.params) req.params = schema.params.parse(req.params);

			return next();
		}
		catch (error: any) {
			logger.warn(`Validation failed: ${error.message}`);
			return sendError(res, "VALIDATION_ERROR", 400);
		}
	};
}