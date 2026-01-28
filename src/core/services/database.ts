/**
 * @file database.ts
 * @description MySQL database helper with connection pooling and bootstrap logic
 * @version 1.1.0
 *
 * Copyright (c) 2025 swisser
 */

import crypto from "node:crypto";
import mysql from "mysql2/promise";
import { config } from "../config.js";
import { logger } from "../logger.js";

/**
 * Database helper responsible for:
 * - Managing the MySQL connection pool
 * - Executing parameterized queries
 * - Bootstrapping required tables
 * - Creating the initial authentication token on first run
 */
export class Database {
	/**
	 * MySQL connection pool instance.
	 * A single pool is used for the entire application lifecycle.
	 */
	private pool: mysql.Pool;
	private closed = false;

	/**
	 * Initializes the database connection pool using environment configuration.
	 * The application fails fast if the connection cannot be established.
	 */
	constructor() {
		this.pool = mysql.createPool({
			host: config.db.host,
			user: config.db.user,
			password: config.db.password,
			database: config.db.database,
			waitForConnections: true,
			connectionLimit: 10,
			queueLimit: 0
		});
	}

	/**
	 * Executes a SQL query using prepared statements.
	 *
	 * @template T Expected return type
	 * @param sql SQL query string
	 * @param params Optional query parameters
	 * @returns Query result casted to type T
	 *
	 * @throws Error if the query fails
	 */
	public async query<T = unknown>(sql: string, params?: unknown[]): Promise<T> {
		try {
			const [rows] = await this.pool.query(sql, params);
			return rows as T;
		}
		catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			logger.error(`Database query failed: ${message}`);
			throw new Error(`Database query failed: ${message}`);
		}
	}

	/**
	 * Ensures all required tables exist.
	 * This method is idempotent and safe to run on every startup.
	 */
	public async ensureTables(): Promise<void> {
		try {
			await this.query(`
				CREATE TABLE IF NOT EXISTS auth_tokens (
					id INT AUTO_INCREMENT PRIMARY KEY,
					token VARCHAR(255) NOT NULL UNIQUE,
					name VARCHAR(100) DEFAULT NULL,
					type ENUM('personal','system') NOT NULL DEFAULT 'personal',
					max_requests INT DEFAULT NULL,
					created_at BIGINT(20) NOT NULL DEFAULT (UNIX_TIMESTAMP()),
					expires_at BIGINT(20) DEFAULT NULL
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
			`);

			await this.query(`
				CREATE TABLE IF NOT EXISTS auth_token_ips (
					id INT AUTO_INCREMENT PRIMARY KEY,
					token_id INT NOT NULL,
					ip VARCHAR(45) NOT NULL,
					UNIQUE KEY uniq_token_ip (token_id, ip),
					CONSTRAINT fk_token_ip
						FOREIGN KEY (token_id)
						REFERENCES auth_tokens(id)
						ON DELETE CASCADE
				) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
			`);

			logger.success("Database tables checked/created successfully.");
		}
		catch (error: unknown) {
			const message = error instanceof Error ? error.message : String(error);
			logger.fatal(`Failed to ensure database tables: ${message}`);
			throw error;
		}
	}

	/**
	 * Creates an initial authentication token if none exist.
	 *
	 * This token is generated once, printed once, and never shown again.
	 * If tokens already exist, this method does nothing.
	 */
	public async ensureInitialToken(): Promise<void> {
		const result = await this.query<{ cnt: number }[]>(
			"SELECT COUNT(*) AS cnt FROM auth_tokens"
		);

		if (result[0].cnt > 0) {
			logger.debug("Auth tokens already exist, skipping initial token creation.");
			return;
		}

		const token = crypto.randomBytes(32).toString("hex");

		const insertResult = await this.query<mysql.ResultSetHeader>(
			`
			INSERT INTO auth_tokens (token, name, type)
			VALUES (?, ?, ?)
			`,
			[token, "Initial token", "system"]
		);

		const tokenId = insertResult.insertId;

		await this.query(
			`
			INSERT INTO auth_token_ips (token_id, ip)
			VALUES (?, ?), (?, ?)
			`,
			[tokenId, "127.0.0.1", tokenId, "::1"]
		);

		logger.info(`Initial token created (printed once): ${token}`);
	}

	public async close(): Promise<void> {
		if (this.closed) return;
		this.closed = true;

		logger.info(`Closing database connection pool..`);
		await this.pool.end();
	}
}

export const database = new Database();
