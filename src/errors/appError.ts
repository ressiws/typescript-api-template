export abstract class AppError extends Error {
	public abstract readonly statusCode: number;
	public abstract readonly code: string;
	public readonly isOperational = true;
	public readonly requestId?: string;

	constructor(message: string, requestId?: string) {
		super(message);

		this.name = new.target.name;
		this.requestId = requestId;

		Error.captureStackTrace(this, new.target);
	}
}

export class ValidationError extends AppError {
	public readonly statusCode = 400;
	public readonly code = "VALIDATION_ERROR";
}

export class AuthenticationError extends AppError {
	public readonly statusCode = 401;
	public readonly code = "AUTHENTICATION_ERROR";
}

export class AuthorizationError extends AppError {
	public readonly statusCode = 403;
	public readonly code = "AUTHORIZATION_ERROR";
}

export class NotFoundError extends AppError {
	public readonly statusCode = 404;
	public readonly code = "NOT_FOUND";
}

export class ConflictError extends AppError {
	public readonly statusCode = 409;
	public readonly code = "CONFLICT";
}

export class RateLimitError extends AppError {
	public readonly statusCode = 429;
	public readonly code = "TOO_MANY_REQUESTS";
}

export class ServiceUnavailableError extends AppError {
	public readonly statusCode = 503;
	public readonly code = "SERVICE_UNAVAILABLE";
}