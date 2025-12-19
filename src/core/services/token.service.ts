/**
 * @file token.service.ts
 * @description Token validation service
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { logger } from "@/core/logger";
import { database, DatabaseType } from "@/core/services/database";
import type { TokenContext, TokenType } from "@/core/types";
import { getUnixTimestamp, isRowArray } from "@/utils/utils";

export let tokens = new Map<string, TokenContext>();

export async function loadTokens(): Promise<number> {
	const result = await database.query(
		DatabaseType.Main,
		"SELECT * FROM auth_tokens"
	);

	if (!isRowArray(result))
		throw new Error("Invalid token query result.");

	const newTokens = new Map<string, TokenContext>();

	for (const row of result) {
		if (typeof row.token !== "string" || typeof row.type !== "string" || typeof row.id !== "number")
			continue;

		const allowedIps = typeof row.allowed_ips === "string" ? JSON.parse(row.allowed_ips) : [];
		const createdAt = getUnixTimestamp(row.created_at);
		const expiresAt = row.expires_at ? getUnixTimestamp(row.expires_at) : null;

		newTokens.set(row.token, {
			id: row.id,
			token: row.token,
			name: row.name ?? null,
			type: row.type as TokenType,
			allowedIps,
			maxRequests: row.max_requests ?? null,
			createdAt,
			expiresAt
		});
	}


	tokens = newTokens; // atomic swap to avoid race conditions
	logger.info(`Loaded ${tokens.size} tokens into memory.`);
	return tokens.size;
}

export function validateToken(token: string): TokenContext | null {
	const ctx = tokens.get(token);
	if (!ctx) return null;
	return ctx;
}