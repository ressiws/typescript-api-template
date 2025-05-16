/**
 * @file loader.ts
 * @description  A file loader that logs messages while loading components or steps.
 * @version 1.0.0
 */

import { config } from "@/config.js";
import { logger } from "./logger.js";
import { checkRequest, loadRoutes } from "./route-loader.js";
import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

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

		const endpoints = await loadRoutes();

		for (const { route_path, handler } of endpoints) {
			const full_path = handler.params && handler.params.length > 0
				? route_path + "/" + handler.params.map(p => `:${p}`).join("/")
				: route_path;

			app.get(full_path, async (req, res) => {
				if (!(await checkRequest(req, res, handler)))
					return;

				await handler.endpoint(req, res);
			});
		}

		app.listen(config.api_port, () => {
			logger.success(`API running at ${config.api_base_url}`);
		});
	}
}

export const loader = Loader;