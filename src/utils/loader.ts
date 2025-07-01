/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @file loader.ts
 * @description  A file loader that logs messages while loading components or steps.
 * @version 1.0.0
 */

import { config } from "@/config.js";
import { logger } from "./logger.js";
import { loadRoutes, registerRouteMeta } from "./route-loader.js";
import express from "express";
import cors from "cors";
import compression from "compression";
import { middleware } from "@/middleware.js";

const app = express();

class Loader {
	constructor() { }

	/**
	 * Starts the boot process and logging the status
	 */
	public static async init() {
		logger.info("Initializing TypeScript API Template..");

		if (config.maintenance)
			logger.warn("Maintenance mode is enabled. This should not be used in production.");

		await this.initEndpoints();

		logger.success("Typescript API Template has been successfully started.");
	}

	private static async initEndpoints() {
		logger.info(`
                ===========================================
                              LOADING ENDPOINTS
                ===========================================`);

		const routes = await loadRoutes();

		app.use(cors());
		app.use(compression());
		app.use(express.json());
		app.use(middleware);

		for (const { route_path, router, meta } of routes) {
			registerRouteMeta("/api" + route_path, meta);

			router.use((req, res, next) => {
				(req as any).routeMeta = meta;
				next();
			});

			app.use("/api" + route_path, router);
		}

		app.listen(config.api_port, () => {
			logger.success(`API running at ${config.api_base_url}`);
		});
	}
}

export const loader = Loader;