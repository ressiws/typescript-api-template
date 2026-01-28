/**
 * @file app.ts
 * @description Application bootstrap entrypoint
 * @version 1.0.0
 *
 * Handles initial logging, environment checks, and database setup
 * before starting the Express server.
 *
 * Copyright (c) 2025 Swisser
 */

import { config } from "./core/config.js";
import "./core/exceptions.js";
import { logger } from "./core/logger.js";
import { database } from "./core/services/database.js";
import { startServer } from "./server/server.js";

async function main() {
	try {
		logger.info(`[BOOT] Starting ${config.app.name} at http://localhost:${config.app.port}/`);
		logger.debug(`[BOOT] Enviroment: ${config.env}`);

		await database.ensureTables();
		await database.ensureInitialToken();
		await startServer();
	}
	catch (error) {
		logger.error(`Application failed to start. ${error}`);
		await database.close().catch(err => logger.error(`Failed to close DB pool: ${err}`));
		process.exitCode = 1;
		throw error;
	}
}

main();
