/* eslint-disable no-console */

/**
 * thanks to:
 * Copyright 2025 DarkenLM (https://github.com/darkenlm)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

//#region ============== Constants ===============
const LEVELS = {
	fatal: 1,
	error: 2,
	warn: 3,
	info: 4,
	debug: 5,
	success: 6
} as const;
type Level = typeof LEVELS[keyof typeof LEVELS];

const _LEVEL_PROPS = {
	[LEVELS.debug]: { color: "35", label: "DEBUG" },
	[LEVELS.info]: { color: "34", label: "INFO" },
	[LEVELS.warn]: { color: "33", label: "WARN" },
	[LEVELS.error]: { color: "91", label: "ERROR" },
	[LEVELS.fatal]: { color: "31", label: "FATAL" },
	[LEVELS.success]: { color: "32", label: "SUCCESS" }
};

const LOGGER_MIN_LEVEL = LEVELS.fatal;
const LOGGER_MAX_LEVEL = LEVELS.debug;
//#endregion ============= Constants ===============

//#region ============== Variables ===============
let g_loggingEnabled = true;
let g_errorLoggingEnabled = true;
let g_loggingLevel: Level = LEVELS.info;
//#endregion ============= Variables ===============

//#region ============== Functions ===============
function _log(level: Level, ...args: unknown[]) {
	if (!g_loggingEnabled && (g_errorLoggingEnabled && (level !== LEVELS.error && level !== LEVELS.fatal))) return;
	if (typeof level !== "number" || !_LEVEL_PROPS[level]) throw new Error("Invalid log level");
	if (level > g_loggingLevel) return;

	const { color, label } = _LEVEL_PROPS[level];
	const timestamp = new Date().toISOString();
	const formattedArgs = args.map(arg => (typeof arg === "object" ? arg : `\x1b[${color}m${arg}\x1b[0m`));
	console.log(`\x1b[${color}m[${timestamp}] [${label}]\x1b[0m`, ...formattedArgs);
}

function debug(...args: unknown[]) {
	_log(LEVELS.debug, ...args);
}

function info(...args: unknown[]) {
	_log(LEVELS.info, ...args);
}

function warn(...args: unknown[]) {
	_log(LEVELS.warn, ...args);
}

function error(...args: unknown[]) {
	_log(LEVELS.error, ...args);
}

function fatal(...args: unknown[]) {
	_log(LEVELS.fatal, ...args);
	process.exit(1);
}

function success(...args: unknown[]) {
	_log(LEVELS.success, ...args);
}

function setLoggingEnabled(enabled: boolean, allowError = true) {
	g_loggingEnabled = enabled;
	g_errorLoggingEnabled = allowError;
}

function setLoggerLevel(level: Level) {
	g_loggingLevel = level;
}
//#endregion ============= Functions ===============

//#region ============== Exports ===============
export {

	debug, error, fatal, info, Level,

	LEVELS, LOGGER_MAX_LEVEL, LOGGER_MIN_LEVEL, setLoggerLevel, setLoggingEnabled, success, warn
};
//#endregion ============= Exports ===============