/**
 * @file config.ts
 * @description Application configuration loader and validator
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import dotenv from "dotenv";

dotenv.config();

/**
 * @description Valid Node environments
 */
type NodeEnv = "development" | "production" | "test";

/**
 * @description Ensures that a required environment variable exists
 * @param key - The environment variable key
 * @throws Error if the variable is missing
 */
function requireEnv(key: string): string {
	const value = process.env[key];
	if (!value) throw new Error(`Missing environment variable: ${key}`);
	return value;
}

/**
 * @description Parses a string into a number
 * @param value - The string to parse
 * @param key - The environment variable key (for error messages)
 * @paran defaultValue - Optional default if value is undefined
 * @throws Error if parsing fails
 */
function parseNumber(value: string | undefined, key: string, defaultValue?: number): number {
	if (!value) {
		if (defaultValue !== undefined) return defaultValue;
		throw new Error(`Missing numeric environment variable: ${key}`);
	}

	const n = Number(value);
	if (Number.isNaN(n))
		throw new Error(`Invalid number for environment variable ${key}`);

	return n;
}

/**
 * @description Strictly parse a string into a boolean
 * @param value - The string to parse ("true" or "false")
 * @param key - The environment variable key (used for error messages)
 * @throws Error if value is undefined or not "true"/"false"
 */
function parseBooleanStrict(value: string | undefined, key: string): boolean {
	if (value === undefined)
		throw new Error(`Missing boolean environment variable: ${key}`);

	const normalized = value.trim().toLowerCase();
	if (normalized === "true") return true;
	if (normalized === "false") return false;

	throw new Error(`Invalid boolean for ${key}. Use true or false.`);
}

function parseBooleanOptional(value: string | undefined, key: string, defaultValue: boolean): boolean {
	if (value === undefined) return defaultValue;
	return parseBooleanStrict(value, key);
}

/**
 * @description Load and validate NODE_ENV
 */
const nodeEnv = requireEnv("NODE_ENV") as NodeEnv;
if (!["development", "production", "test"].includes(nodeEnv))
	throw new Error(`invalid NODE_ENV: ${nodeEnv}`);

/**
 * @description Valid HTTP methods for CORS
 */
const validMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"];

/**
 * @description Parse and validate CORS methods from ENV
 */
let corsMethods: string[] | undefined;
if (process.env.CORS_METHODS) {
	corsMethods = process.env.CORS_METHODS.split(",").map(m => m.trim().toUpperCase());
	for (const m of corsMethods) {
		if (!validMethods.includes(m)) throw new Error(`Invalid CORS method: ${m}`);
	}
}

/**
 * @description Application configuration object
 * @property env - Node environment
 * @property app - Application-specific settings
 * @property cors - CORS configuration (optional)
 * @property security - Security-related configuration
 * @property db - Database configuration
 */
export const config = Object.freeze({
	env: nodeEnv,
	app: {
		name: requireEnv("APP_NAME"),
		port: parseNumber(requireEnv("APP_PORT"), "APP_PORT"),
		version: requireEnv("APP_VERSION"),
		trustProxy: parseBooleanOptional(process.env.TRUST_PROXY, "TRUST_PROXY", false),
	},
	cors: {
		origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map(o => o.trim()) : undefined,
		methods: corsMethods,
		credentials: parseBooleanStrict(process.env.CORS_CREDENTIALS, "CORS_CREDENTIALS"),
	},
	security: {
		headers: {
			enable: parseBooleanStrict(process.env.HEADERS_ENABLE, "HEADERS_ENABLE"),
		},
		ipGuard: {
			enable: parseBooleanStrict(process.env.IPGUARD_ENABLE, "IPGUARD_ENABLE"),
			windowMs: parseNumber(process.env.IPGUARD_WINDOW_MS, "IPGUARD_WINDOW_MS", 60_000),
			maxRequests: parseNumber(process.env.IPGUARD_MAX_REQUESTS, "IPGUARD_MAX_REQUESTS", 100),
		},
		validate: {
			enable: parseBooleanStrict(process.env.VALIDATE_ENABLE, "VALIDATE_ENABLE")
		},
		auth: {
			enable: parseBooleanStrict(process.env.AUTH_ENABLE, "AUTH_ENABLE"),
		},
		rateLimit: {
			enable: parseBooleanStrict(process.env.RATE_LIMIT_ENABLE, "RATE_LIMIT_ENABLE"),
			windowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, "RATE_LIMIT_WINDOW_MS", 60_000),
			maxRequests: parseNumber(process.env.RATE_LIMIT_MAX_REQUESTS, "RATE_LIMIT_MAX_REQUESTS", 20),
		},
		logging: {
			enable: parseBooleanStrict(process.env.LOGGING_ENABLE, "LOGGING_ENABLE")
		}
	},
	db: {
		host: requireEnv("DB_HOST"),
		user: requireEnv("DB_USER"),
		password: requireEnv("DB_PASS"),
		database: requireEnv("DB_NAME"),
	}
});
