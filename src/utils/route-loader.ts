import { Request, Response, Router } from "express";
import { readdir, stat } from "fs/promises";
import { getIPv4 } from "@utils/utils.js";
import { logger } from "@utils/logger.js";
import { config } from "@/config.js";
import { __dirname } from "@utils/utils.js";
import { pathToFileURL } from "url";
import path from "path";

export interface EndpointMeta {
	name: string;
	description: string;
	version: string;
	private?: boolean;
}

export const route_meta_map = new Map<string, EndpointMeta>();

export function registerRouteMeta(path: string, meta: EndpointMeta, methods: string[] = ["GET", "POST", "PUT", "DELETE", "PATCH"]) {
	route_meta_map.set(path, meta);
	for (const method of methods) {
		route_meta_map.set(`${method.toUpperCase()} ${path}`, meta);
	}
}

async function getAllFiles(dir: string): Promise<string[]> {
	const files = await readdir(dir);
	const all_files: string[] = [];

	for (const file of files) {
		const full_path = path.join(dir, file);
		const file_stat = await stat(full_path);

		if (file_stat.isDirectory()) {
			const sub_files = await getAllFiles(full_path);
			all_files.push(...sub_files);
		}
		else if (file.endsWith(".ts") || file.endsWith(".js")) {
			all_files.push(full_path);
		}
	}

	return all_files;
}

export async function checkRequest(req: Request, res: Response, handler: EndpointMeta): Promise<boolean> {
	const method = req.method;
	const url = req.originalUrl;
	const ip = await getIPv4(req);

	if (config.allowed_ips.includes(ip))
		return true;

	logger.debug(`Incoming ${method} request from ${ip} to ${url}`);

	if (handler.private === true && config.block_via_ip && !config.allowed_ips.includes(ip)) {
		logger.warn(`Tried to access **${url}** without an authorized IP.`);
		res.status(404).end();
		return false;
	}

	if (handler.private === true && config.require_token) {
		const token = req.headers.authorization?.replace("Bearer ", "");
		if (!token || token !== config.api_token) {
			logger.warn(`Tried to access **${url}** without an authorized token.`);
			res.status(401).json({ error: "Invalid or missing token." });
			return false;
		}
	}

	return true;
}

export async function loadRoutes(): Promise<{ route_path: string, router: Router; meta: EndpointMeta }[]> {
	const api_dir = path.resolve(__dirname, "api");
	const files = await getAllFiles(api_dir);
	const routes: { route_path: string, router: Router; meta: EndpointMeta }[] = [];

	let loaded = 0, failed = 0;

	logger.info(`Searching for endpoints in: ${api_dir}`);

	for (const file_path of files) {
		try {
			const file_url = pathToFileURL(file_path).href;
			const module = await import(file_url);

			if (module.default && module.config) {
				const router: Router = module.default;
				const meta: EndpointMeta = module.config;

				if (!meta || !meta.name || !meta.version) {
					logger.warn(`Endpoint in "${file_path}" missing required metadata.`);
					failed++;
					continue;
				}

				let relative_path = file_path
					.replace(api_dir, "")
					.replace(/\\/g, "/")
					.replace(/\.(ts|js)$/, "");

				if (relative_path.endsWith("/index")) {
					relative_path = relative_path.replace(/\/index$/, "") || "/";
				}

				if (!relative_path.startsWith("/")) {
					relative_path = "/" + relative_path;
				}

				routes.push({ route_path: relative_path, router, meta });
				loaded++;

				logger.success(`Successfully loaded "${meta.name}" endpoint (v${meta.version}) at "/api${relative_path}"`);
			}
			else {
				logger.warn(`Endpoint in "${file_path}" does not export a default router or config metadata.`);
				failed++;
			}
		}
		catch (err) {
			logger.error(`Failed to load endpoint from "${file_path}": ${err}`);
			failed++;
			continue;
		}
	}

	logger.success(`Loaded ${loaded}/${loaded + failed} API endpoints.`);
	return routes;
}