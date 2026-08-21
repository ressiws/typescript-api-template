import fs from "node:fs";
import path from "node:path";
import pino from "pino";

import type { LogCategory } from "../types/logging.js";

const LOG_DIR = path.resolve("logs");

fs.mkdirSync(LOG_DIR, { recursive: true });

const isProduction = process.env.NODE_ENV === "production";

const logFile = pino.destination({
	dest: path.join(
		LOG_DIR,
		`${new Date().toISOString().slice(0, 10)}.log`,
	),
	append: true,
	mkdir: true,
});

const RESET = "\x1b[0m";

const COLORS = {
	timestamp: "\x1b[90m",
	category: "\x1b[36m",
	success: "\x1b[32m",
	info: "\x1b[36m",
	warn: "\x1b[33m",
	error: "\x1b[31m",
	debug: "\x1b[35m",
	context: "\x1b[90m",
} as const;

const LEVELS: Record<number, keyof typeof COLORS> = {
	20: "debug",
	30: "info",
	35: "success",
	40: "warn",
	50: "error",
};

function formatValue(value: unknown): string {
	if (typeof value === "string") {
		return `"${value}"`;
	}

	if (value instanceof Error) {
		return `"${value.message}"`;
	}

	try {
		return JSON.stringify(value);
	} catch {
		return "[Unserializable]";
	}
}

function formatContext(entry: Record<string, unknown>): string {
	const excluded = new Set([
		"level",
		"time",
		"category",
		"msg",
	]);

	const values = Object.entries(entry)
		.filter(([key]) => !excluded.has(key))
		.map(([key, value]) => `${key}: ${formatValue(value)}`);

	return values.length > 0
		? `${COLORS.context}{ ${values.join(", ")} }${RESET}`
		: "";
}

function formatTimestamp(value: unknown): string {
	if (typeof value === "number") {
		return new Date(value).toUTCString();
	}

	if (typeof value === "string") {
		const numericValue = Number(value);

		if (!Number.isNaN(numericValue)) {
			return new Date(numericValue).toUTCString();
		}

		const parsed = new Date(value);

		if (!Number.isNaN(parsed.getTime())) {
			return parsed.toUTCString();
		}
	}

	return "Invalid Date";
}

function formatConsoleLog(line: string): string {
	try {
		const entry = JSON.parse(line) as Record<string, unknown>;
		const timestamp = formatTimestamp(entry.time);
		const level = LEVELS[Number(entry.level)] ?? "info";
		const category = String(entry.category ?? "SYSTEM");
		const message = String(entry.msg ?? "");
		const context = formatContext(entry);

		return [
			`${COLORS.timestamp}[${timestamp}]${RESET}`,
			`${COLORS.category}[${category}]${RESET}`,
			`${COLORS[level]}${level.toUpperCase().padEnd(5)}${RESET}`,
			"|",
			message,
			context,
		]
			.filter(Boolean)
			.join(" ");
	} catch {
		return line;
	}
}

const consoleStream = isProduction
	? process.stdout
	: {
		write(chunk: string): boolean {
			process.stdout.write(
				formatConsoleLog(chunk.trimEnd()) + "\n",
			);

			return true;
		},
	};

export const logger = pino(
	{
		level:
			process.env.LOG_LEVEL ??
			(isProduction ? "info" : "debug"),

		base: null,

		customLevels: {
			success: 35,
		},

		timestamp: pino.stdTimeFunctions.isoTime,

		redact: {
			paths: [
				"password",
				"passwordConfirmation",
				"token",
				"accessToken",
				"refreshToken",
				"sessionToken",
				"secret",
				"apiKey",
				"req.headers.authorization",
				"req.headers.cookie",
			],
			censor: "[REDACTED]",
		},
	},

	pino.multistream([
		{
			stream: consoleStream,
		},
		{
			stream: logFile,
		},
	]),
);

export type { LogCategory };

