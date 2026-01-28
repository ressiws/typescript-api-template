/**
 * @file exceptions.ts
 * @description Global process error handlers (uncaughtException & unhandledRejection)
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { logger } from "./logger.js";

// Uncaught Exception
process.on("uncaughtException", (error) => {
	logger.fatal(`Uncaught exception: ${error}`);
	process.exitCode = 1;
});

// Unhandled Promise Rejections
process.on("unhandledRejection", (reason) => {
	logger.error(`Unhandled promise rejection: ${reason}`);
});
