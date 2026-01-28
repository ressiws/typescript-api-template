/**
 * @file logger.ts
 * @description Central application logger with color support
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "./config.js";

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal" | "success";

const levels: Record<LogLevel, number> = {
	debug: 10,
	info: 20,
	success: 25,
	warn: 30,
	error: 40,
	fatal: 50
};

const currentLevel = config.env === "development" ? levels.debug : levels.info;

const colors: Record<LogLevel, string> = {
	debug: "\x1b[90m", // light gray
	info: "\x1b[36m",  // cyan
	success: "\x1b[32m", // green
	warn: "\x1b[33m",  // yellow
	error: "\x1b[31m", // red
	fatal: "\x1b[41m", // red background
};

const reset = "\x1b[0m";

const loggingEnabled = config.security.logging.enable;
const isDev = config.env === "development";

function format(level: LogLevel, message: string, meta?: unknown): string {
	const timestamp = new Date().toUTCString();
	const base = `${timestamp} | ${level.toUpperCase()} | ${message}`;

	if (!meta)
		return base;

	try {
		return `${base} ${JSON.stringify(meta)}`;
	} catch {
		return `${base} [meta:unserializable]`;
	}
}

function write(level: LogLevel, message: string, meta?: unknown): void {
	if (!loggingEnabled && level !== "fatal") return;
	if (levels[level] < currentLevel) return;

	const output = `${colors[level]}${format(level, message, meta)}${reset}`;

	if (levels[level] >= levels.error)
		process.stderr.write(output + "\n");
	else
		process.stdout.write(output + "\n");
}

export const logger = Object.freeze({
	debug: (msg: string, meta?: unknown) => {
		if (!isDev) return;
		write("debug", msg, meta);
	},
	info: (msg: string, meta?: unknown) => write("info", msg, meta),
	success: (msg: string, meta?: unknown) => write("success", msg, meta),
	warn: (msg: string, meta?: unknown) => write("warn", msg, meta),
	error: (msg: string, meta?: unknown) => write("error", msg, meta),
	fatal: (msg: string, meta?: unknown) => write("fatal", msg, meta)
});
