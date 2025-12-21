/**
 * @file exceptions.ts
 * @description Global process error handlers (uncaughtException & unhandledRejection)
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { logger } from "./logger";

// Uncaught Exception
process.on("uncaughtException", (error) => {
	logger.error(`Uncaught exception: ${error}`);
});

// Unhandled Promise Rejections
process.on("unhandledRejection", (reason) => {
	logger.error(`Unhandled promise rejection: ${reason}`);
});
