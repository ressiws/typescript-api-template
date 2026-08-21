import type { AuditLogEntry } from "../types/audit.js";
import { logger } from "./logger.js";

const SENSITIVE_FIELDS = new Set([
	"password",
	"passwordHash",
	"token",
	"accessToken",
	"refreshToken",
	"sessionToken",
	"secret",
	"apiKey",
]);

function sanitizeMetadata(
	metadata?: Record<string, unknown>,
): Record<string, unknown> {
	if (!metadata) {
		return {};
	}

	return Object.fromEntries(
		Object.entries(metadata).map(([key, value]) => [
			key,
			SENSITIVE_FIELDS.has(key) ? "[REDACTED]" : value,
		]),
	);
}

export class AuditLogger {
	public static log(entry: AuditLogEntry): void {
		const context = {
			category: "AUDIT",
			action: entry.action,
			result: entry.result,
			actorId: entry.actorId,
			targetId: entry.targetId,
			requestId: entry.requestId,
			timestamp: entry.timestamp ?? new Date().toISOString(),
			metadata: sanitizeMetadata(entry.metadata),
		};

		if (entry.result === "FAILURE") {
			logger.warn(context, "Audit event");
			return;
		}

		logger.info(context, "Audit event");
	}
}