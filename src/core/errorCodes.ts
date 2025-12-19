/**
 * @file errorCodes.ts
 * @description Centralized API error codes
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

export const ErrorCodes = {
	NO_TOKEN: "No token provided.",
	RATE_LIMIT: "Too many requests.",
	UNAUTHORIZED: "Unauthorized access.",
	INVALID_TOKEN: "Invalid token.",
	EXPIRED_TOKEN: "Expired token.",
	VALIDATION_ERROR: "Invalid request payload.",
	INTERNAL_ERROR: "Internal server error.",
} as const;