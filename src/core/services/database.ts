
/**
 * @file db.ts
 * @description MySQL multi-database query helper using mysql2
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import crypto from "crypto";
import mysql from "mysql2/promise";
import { config } from "../config";
import { logger } from "../logger";

/**
 * Enum for available databases
 */
export enum DatabaseType {
	Main = "api_swisser" // <-- Change this to the name of your database
}

/**
 * Execute a query on the specified database
 */
export class Database {
	private pools: Record<DatabaseType, mysql.Pool>;

	constructor() {
		this.pools = {
			[DatabaseType.Main]: mysql.createPool({
				host: config.db.host,
				user: config.db.user,
				password: config.db.password,
				database: DatabaseType.Main,
				waitForConnections: true,
				connectionLimit: 10,
				queueLimit: 0
			})
		};
	}

	public async query(db: DatabaseType, sql: string, params?: unknown[]) {
		try {
			const [rows] = await this.pools[db].query(sql, params);
			return rows;
		}
		catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			logger.error(`Query failed on ${db} DB: ${message}`);
			throw new Error(`Query failed on ${db} DB: ${message}`);
		}
	}

	public async ensureTables() {
		const sql = `
		CREATE TABLE IF NOT EXISTS auth_tokens (
			id INT AUTO_INCREMENT PRIMARY KEY,
			token VARCHAR(255) NOT NULL UNIQUE,
			name VARCHAR(100) DEFAULT NULL,
			type ENUM('personal','system') NOT NULL DEFAULT 'personal',
			allowed_ips LONGTEXT DEFAULT NULL,
			max_requests INT DEFAULT NULL,
			created_at BIGINT(20) NOT NULL DEFAULT (UNIX_TIMESTAMP()),
			expires_at BIGINT(20) DEFAULT NULL
		) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
		`;

		try {
			await this.query(DatabaseType.Main, sql);
			logger.success("Auth_tokens table checked/created successfully.");
		}
		catch (error: unknown) {
			logger.error(`Failed to ensure necessary tables: ${error instanceof Error ? error.message : error}`);
			throw error;
		}
	}

	public async ensureInitialToken() {
		const result = await this.query(DatabaseType.Main, "SELECT COUNT(*) AS cnt FROM auth_tokens") as { cnt: number }[];
		const count = result[0].cnt;

		if (count === 0) {
			const token = crypto.randomBytes(32).toString("hex");

			await this.query(
				DatabaseType.Main,
				`
					INSERT INTO auth_tokens (token, name, allowed_ips)
					VALUES (?, ?, ?)
				`,
				[token, "Initial token", JSON.stringify(["127.0.0.1", "::1"])]
			);

			logger.info(`Initial token created: ${token}`);
		}
		else {
			logger.debug("Tokens already exist, skipping initial token creation.");
			return;
		}
	}
}

export const database = new Database();