/**
 * @file health.ts
 * @description Health check route
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { config } from "@/core/config";
import { sendSuccess } from "@/core/helpers/response.helper";
import type { Request, Response, Router } from "express";
import express from "express";

const router: Router = express.Router();

router.get("/", async (_req: Request, res: Response) => {
	const memory = process.memoryUsage();

	sendSuccess(res, "Health check passed.", {
		status: "ok",
		service: config.app.name,
		version: config.app.version,
		uptime: `${Math.floor(process.uptime())}s`,
		platform: process.platform,
		memory: {
			rss: memory.rss,
			heapUsed: memory.heapUsed,
			heapTotal: memory.heapTotal,
		},
		env: process.env.NODE_ENV,
		features: {
			headers: config.security.headers.enable,
			ipGuard: config.security.ipGuard.enable,
			auth: config.security.auth.enable,
			rateLimit: config.security.rateLimit.enable,
			logging: config.security.logging.enable,
		},
	});
});

export default router;
