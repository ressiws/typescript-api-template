import type { FastifyInstance } from "fastify";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";

import { logger } from "../logging/logger.js";
import type { Router } from "../routing/router.js";
import { __dirname } from "../utils/paths.js";

interface RouteModule {
	router?: Router;
}

const ROUTES_DIRECTORY = path.resolve(__dirname, "routes");

async function findRouteFiles(directory: string): Promise<string[]> {
	const entries = await readdir(directory, {
		withFileTypes: true,
	});

	const files: string[] = [];

	for (const entry of entries) {
		const entryPath = path.join(directory, entry.name);

		if (entry.isDirectory()) {
			files.push(...await findRouteFiles(entryPath));
			continue;
		}

		if (
			entry.isFile() &&
			(entry.name.endsWith(".ts") || entry.name.endsWith(".js")) &&
			!entry.name.endsWith(".d.ts") &&
			!entry.name.endsWith(".d.js")
		) {
			files.push(entryPath);
		}
	}

	return files;
}

function getRoutePrefix(filePath: string): string {
	const relativePath = path.relative(
		ROUTES_DIRECTORY,
		filePath,
	);

	const parts = relativePath.split(path.sep);
	const fileName = parts.pop();

	if (!fileName) {
		throw new Error(`Invalid route file: ${filePath}`);
	}

	const routeName = fileName.replace(/\.(ts|js)$/, "");
	const routeVersion = parts.join("/");

	if (!routeVersion) {
		throw new Error(
			`Route "${filePath}" must be inside a version directory.`,
		);
	}

	return `/${routeVersion}/${routeName}`;
}

export async function loadRoutes(app: FastifyInstance): Promise<void> {
	const start = performance.now();

	logger.info(
		{
			category: "SYSTEM",
		},
		"Loading routes",
	);

	const routeFiles = await findRouteFiles(ROUTES_DIRECTORY);

	for (const filePath of routeFiles) {
		const prefix = getRoutePrefix(filePath);

		const module = await import(
			pathToFileURL(filePath).href
		) as RouteModule;

		if (!module.router) {
			throw new Error(
				`Route "${filePath}" must export a "router".`,
			);
		}

		module.router.register(app, prefix);

		logger.info(
			{
				category: "HTTP",
			},
			`Route loaded ${prefix}`,
		);
	}

	logger.info(
		{
			category: "SYSTEM",
		},
		`Routes loaded ${routeFiles.length} routes in ${Math.round(performance.now() - start)}ms`,
	);
}