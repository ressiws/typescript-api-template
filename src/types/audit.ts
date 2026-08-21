export type AuditResult = "SUCCESS" | "FAILURE";

export interface AuditLogEntry {
	action: string;
	result: AuditResult;
	actorId?: string;
	targetId?: string;
	requestId?: string;
	metadata?: Record<string, unknown>;
	timestamp?: string;
}