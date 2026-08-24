import type { FastifyInstance } from "fastify";
import * as logger from "../logging/logger.js";

interface FastifyLikeError {
	message?: string;
	code?: string;
	statusCode?: number;
}

interface ErrorResponse {
	error: {
		code: string;
		statusCode: number;
		message: string;
		requestId: string;
	};
}

function isErrorObject(error: unknown): error is FastifyLikeError {
	return typeof error === "object" && error !== null;
}

function getStatusCode(error: unknown): number {
	if (
		isErrorObject(error) &&
		typeof error.statusCode === "number" &&
		error.statusCode >= 400 &&
		error.statusCode < 600
	) {
		return error.statusCode;
	}

	return 500;
}

function getErrorCode(
	error: unknown,
	statusCode: number,
): string {
	if (isErrorObject(error)) {
		switch (error.code) {
			case "FST_ERR_CTP_INVALID_JSON_BODY":
				return "INVALID_JSON";

			case "FST_ERR_CTP_BODY_TOO_LARGE":
				return "PAYLOAD_TOO_LARGE";

			case "FST_ERR_VALIDATION":
				return "VALIDATION_ERROR";
		}
	}

	switch (statusCode) {
		case 404:
			return "NOT_FOUND";

		case 429:
			return "RATE_LIMIT_EXCEEDED";

		default:
			return statusCode >= 500
				? "INTERNAL_SERVER_ERROR"
				: "BAD_REQUEST";
	}
}

function getErrorMessage(error: unknown, statusCode: number): string {
	if (statusCode >= 500) {
		return "Internal server error";
	}

	if (isErrorObject(error)) {
		switch (error.code) {
			case "FST_ERR_CTP_INVALID_JSON_BODY":
				return "Invalid JSON payload";

			case "FST_ERR_CTP_BODY_TOO_LARGE":
				return "Request payload is too large";

			default:
				if (typeof error.message === "string") {
					return error.message;
				}
		}
	}

	return "Request failed";
}

export async function registerErrorHandler(app: FastifyInstance): Promise<void> {
	app.setErrorHandler((error, request, reply) => {
		const statusCode = getStatusCode(error);
		const code = getErrorCode(error, statusCode);
		const message = getErrorMessage(error, statusCode);

		logger.error(`Request failed with status ${statusCode} and code ${code} for request ${request.method} ${request.url} with requestId ${request.id}`);

		const response: ErrorResponse = {
			error: {
				code,
				statusCode,
				message,
				requestId: request.id,
			},
		};

		return reply.status(statusCode).send(response);
	});
}