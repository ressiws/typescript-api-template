import { Request, Response, NextFunction } from "express";
import { logger } from "@utils/logger.js";
import { route_meta_map } from "@utils/route-loader.js";
import { getIPv4 } from "./utils/utils.js";
import { config } from "./config.js";

export async function middleware(req: Request, res: Response, next: NextFunction): Promise<void> {
	try {
		const ip = (await getIPv4(req)).toString();
		const method = req.method.toUpperCase();
		const url = req.originalUrl.split("?")[0];
		let meta = route_meta_map.get(`${method} ${url}`);

		if (!meta) {
			meta = route_meta_map.get(url);
		}

		logger.debug(`Incoming ${method} request from ${ip} to ${url}`);

		if (meta?.private) {
			if (!config.allowed_ips.includes(ip)) {
				logger.warn(`[Blocked] IP ${ip} tried to access private route ${url}`);
				res.status(404).end();
				return;
			}

			if (config.require_token) {
				const authHeader = req.headers.authorization;
				const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

				if (!token || token !== config.api_token) {
					logger.warn(`[Blocked] IP ${ip} tried to access private route ${url} with invalid token`);
					res.status(401).json({ error: "Unauthorized: Invalid or missing token." });
					return;
				}
			}
		}

		next();
	}
	catch (error) {
		logger.error(`Error in middleware: ${error}`);
		res.status(500).json({ error: "Internal Server Error" });
		return;
	}
}