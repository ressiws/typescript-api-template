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
	IP_GUARD: "Too many requests.",
	UNAUTHORIZED: "Unauthorized access.",
	INVALID_TOKEN: "Invalid token.",
	EXPIRED_TOKEN: "Expired token.",
	VALIDATION_ERROR: "Invalid request payload.",
	CORS_NOT_ALLOWED: "CORS origin not allowed.",
	INVALID_JSON: "Malformed JSON body.",
	PAYLOAD_TOO_LARGE: "Request body too large.",
	NOT_FOUND: "Route not found.",
	INTERNAL_ERROR: "Internal server error.",
} as const;
