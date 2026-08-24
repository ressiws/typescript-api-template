import type { EnvConfig, NodeEnvironment } from "../types/config.js";

function parseEnvironment(value: string | undefined): NodeEnvironment {
	if (
		value === "development" ||
		value === "production" ||
		value === "test"
	) {
		return value;
	}

	return "development";
}

function parsePort(value: string | undefined): number {
	const port = Number.parseInt(value ?? "3000", 10);

	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error("Invalid PORT configuration");
	}

	return port;
}

export function validateEnv(): EnvConfig {
	const corsOrigins = (process.env.CORS_ORIGINS ?? "")
		.split(",")
		.map((origin) => origin.trim())
		.filter(Boolean);

	return {
		NODE_ENV: parseEnvironment(process.env.NODE_ENV),
		HOST: process.env.HOST ?? "127.0.0.1",
		PORT: parsePort(process.env.PORT),
		CORS_ORIGINS: corsOrigins,
	};
}