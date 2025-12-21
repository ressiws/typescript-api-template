/**
 * @file token.service.ts
 * @description
 * In-memory token management and validation layer.
 *
 * Responsibilities:
 * - Load authentication tokens from the database
 * - Aggregate allowed IPs per token
 * - Cache tokens in memory for fast access
 * - Provide a simple validation lookup used by auth middleware
 *
 * This service is intentionally stateful:
 * tokens are periodically refreshed from the database and atomically swapped
 * to avoid race conditions during reload.
 *
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { logger } from "@/core/logger";
import { database } from "@/core/services/database";
import type { TokenContext, TokenType } from "@/core/types";
import { getUnixTimestamp } from "@/utils/utils";

/**
 * In-memory cache of authentication tokens.
 *
 * Key: raw token string
 * Value: TokenContext containing metadata, permissions and IP restrictions
 *
 * IMPORTANT:
 * - This map is replaced atomically during reloads
 * - It must never be mutated outside the loading phase
 */
export let tokens = new Map<string, TokenContext>();

/**
 * Loads all authentication tokens from the database into memory.
 *
 * Behavior:
 * - Fetches tokens and their allowed IPs using a LEFT JOIN
 * - Aggregates multiple IP rows into a single TokenContext
 * - Performs an atomic swap of the in-memory token map
 *
 * Guarantees:
 * - Tokens without allowed IPs will still exist but may be rejected later by auth middleware
 * - Invalid or malformed database rows are ignored defensively
 *
 * Failure mode:
 * - Throws if the database result is not an array
 * - Does NOT partially update state on failure
 *
 * @returns {Promise<number>} Number of tokens loaded into memory
 * @throws {Error} If the database query result is invalid
 */
export async function loadTokens(): Promise<number> {
	const result = await database.query<{
		id: number;
		token: string;
		name: string | null;
		type: TokenType;
		max_requests: number | null;
		created_at: number;
		expires_at: number | null;
		ip: string | null;
	}[]>(
		`
		SELECT
			t.id,
			t.token,
			t.name,
			t.type,
			t.max_requests,
			t.created_at,
			t.expires_at,
			i.ip
		FROM auth_tokens t
		LEFT JOIN auth_token_ips i ON i.token_id = t.id
		`
	);

	if (!Array.isArray(result))
		throw new Error("Invalid token query result.");

	const newTokens = new Map<string, TokenContext>();

	for (const row of result) {
		if (!newTokens.has(row.token)) {
			newTokens.set(row.token, {
				id: row.id,
				token: row.token,
				name: row.name,
				type: row.type,
				allowedIps: [],
				maxRequests: row.max_requests,
				createdAt: getUnixTimestamp(row.created_at),
				expiresAt: row.expires_at ? getUnixTimestamp(row.expires_at) : null
			});
		}

		// Attach allowed IPs (if any)
		if (row.ip)
			newTokens.get(row.token)!.allowedIps.push(row.ip);
	}


	/**
	 * Atomic swap:
	 * ensures readers never see a partially loaded token set
	 */
	tokens = newTokens;
	logger.info(`Loaded ${tokens.size} tokens into memory.`);
	return tokens.size;
}

/**
 * Validates a raw authentication token.
 *
 * This function performs a pure lookup:
 * - No expiration checks
 * - No IP validation
 * - No rate limit logic
 *
 * Those responsibilities belong to dedicated middleware layers.
 *
 * @param {string} token - Raw token value from request headers
 * @returns {TokenContext | null} Token context if valid, otherwise null
 */
export function validateToken(token: string): TokenContext | null {
	return tokens.get(token) ?? null;
}