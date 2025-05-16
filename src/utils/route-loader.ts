/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { readdir, stat } from "fs/promises";
import { getIPv4 } from "@utils/utils.js";
import { logger } from "@utils/logger.js";
import { config } from "@/config.js";
import { __dirname } from "@utils/utils.js";
import { pathToFileURL } from "url";
import path from "path";

export abstract class Endpoints {
	public name!: string;
	public description!: string;
	public params?: string[];
	public version!: string;
	public private?: boolean;

	public abstract endpoint(req: any, res: any): Promise<void>;
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

export async function checkRequest(req: Request, res: Response, handler: Endpoints): Promise<boolean> {
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

export async function loadRoutes(): Promise<{ route_path: string, handler: Endpoints }[]> {
	const api_dir = path.resolve(__dirname, "api");
	const files = await getAllFiles(api_dir);
	const endpoints: { route_path: string, handler: Endpoints }[] = [];

	let loaded = 0;
	let failed = 0;

	logger.info(`Searching for endpoints in: ${api_dir}`);

	for (const file_path of files) {
		try {
			const file_url = pathToFileURL(file_path).href;
			const module = await import(file_url);

			if (module.default) {
				const instance = new module.default;

				if (instance instanceof Endpoints) {
					const relative_path = file_path
						.replace(api_dir, "")
						.replace(/\\/g, "/")
						.replace(/\.(ts|js)$/, "");

					let route_path = relative_path.startsWith("/") ? relative_path : "/" + relative_path;

					if (instance.params) {
						route_path = route_path.replace(/:(\w+)/g, (_, param) => {
							return instance.params?.includes(param) ? `:${param}` : param;
						});
					}

					endpoints.push({ route_path, handler: instance });
					loaded++;

					logger.success(`Successfully loaded "${instance.name}" endpoint (v${instance.version}) at "${route_path}"`);
				}
				else {
					failed++;

					logger.warn(`File "${file_path}" does not export a valid enpoint class.`);
				}
			}
		}
		catch (err) {
			logger.error(`Failed to load enpoint "${file_path}: ${err}"`);
		}
	}

	logger.success(`Successfully loaded api endpoints ${loaded}/${loaded + failed}`);
	return endpoints;
}