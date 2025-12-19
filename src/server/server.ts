/**
 * @file server.ts
 * @description Express server bootstrap
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "@/core/config";
import { logger } from "@/core/logger";
import { __dirname } from "@/utils/utils";
import compression from "compression";
import cors from "cors";
import type { Application } from "express";
import express from "express";
import fs from "fs";
import path from "path";

import { loadTokens } from "@/core/services/token.service";
import { middleware } from "@/middleware";
import { pathToFileURL } from "url";

export async function registerRoutes(app: Application) {
	const routesPath = path.resolve(__dirname, "routes");
	if (!fs.existsSync(routesPath)) {
		logger.warn(`Routes folder not found: ${routesPath}`);
		return;
	}

	const files = fs.readdirSync(routesPath).filter(f => f.endsWith(".ts") || f.endsWith(".js"));
	if (files.length === 0) {
		logger.warn("No route files found in routes folder.");
		return;
	}

	logger.info(`Starting to register ${files.length} routes from ${routesPath}`);
	let loadedCount = 0;

	for (const file of files) {
		const modulePath = pathToFileURL(path.join(routesPath, file)).href;

		try {
			const routeModule = await import(modulePath);
			if (!routeModule.default) {
				logger.warn(`Route file does not export default: ${file}`);
				continue;
			}

			const routePath = "/" + file.replace(/\.(ts|js)$/, "");
			app.use(routePath, routeModule.default);
			loadedCount++;
			logger.info(`Route loaded: ${routePath}`);
		}
		catch (err) {
			logger.error(`Failed to load route ${file}:`, err);
		}
	}

	logger.info(`Successfully loaded ${loadedCount}/${files.length} routes.`);
}

export async function createServer(): Promise<Application> {
	const app = express();

	app.disable("x-powered-by");

	app.use(cors({
		origin: config.cors.origin ?? "*",
		methods: config.cors.methods ?? ["GET", "POST", "PUT", "DELETE"],
		credentials: config.cors.credentials,
	}));

	app.use(compression());
	app.use(express.json({ limit: "10kb" }));
	app.use(express.urlencoded({ extended: true, limit: "10kb" }));

	middleware(app);

	await registerRoutes(app);
	return app;
}

export async function startServer(): Promise<Application> {
	const count = await loadTokens();
	if (count === 0)
		throw new Error("No tokens loaded, aborting startup..");

	setInterval(() => {
		loadTokens().catch(e => logger.error(`Token refresh failed: ${e}`));
	}, 60_000);

	const app = await createServer();

	app.listen(config.app.port, () => {
		logger.info(`Server running on port: ${config.app.port}`);
	});

	return app;
}