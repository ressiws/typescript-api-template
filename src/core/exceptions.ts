/**
 * @file exceptions.ts
 * @description Global process error handlers (uncaughtException & unhandledRejection)
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { logger } from "./logger";

// Erros não capturados
process.on("uncaughtException", (error) => {
	logger.error(`Uncaught exception: ${error}`);
	process.exit(1);
});

// Promises rejeitadas não tratadas
process.on("unhandledRejection", (reason) => {
	logger.error(`Unhandled promise rejection: ${reason}`);
	process.exit(1);
});
