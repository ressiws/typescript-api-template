/**
 * @file response.helper.ts
 * @description Centralized API response helper
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { ErrorCodes } from "../errorCodes.js";
import type { Response } from "express";

export function sendError(res: Response, code: keyof typeof ErrorCodes, statusCode = 400) {
	return res.status(statusCode ?? 400).json({
		status: "error",
		code,
		message: ErrorCodes[code],
		data: null,
	});
}

export function sendSuccess<T = unknown>(res: Response, message?: string, data: T | null = null) {
	return res.json({
		status: "ok",
		message: message ?? null,
		data,
	});
}
