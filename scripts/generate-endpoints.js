/**
 * @file generate-endpoints.js
 * @description Generates a list of API endpoints for K6 stress testing
 */

import fs from "fs";
import path from "path";

const ROUTES_DIR = path.resolve("../src/routes");
const OUTPUT_FILE = path.resolve("./endpoints.txt");

function getRoutes(dir) {
	const files = fs.readdirSync(dir);
	const routes = [];

	for (const file of files) {
		const fullPath = path.join(dir, file);

		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			routes.push(...getRoutes(fullPath));
			continue;
		}

		if (!file.endsWith(".ts") && !file.endsWith(".js")) continue;

		const routePath = "/" + file.replace(/\.(ts|js)$/, "");
		routes.push(routePath);
	}

	return routes;
}

function writeEndpointsFile(routes, outputFile) {
	const content = routes.join("\n");
	fs.writeFileSync(outputFile, content, "utf8");
	console.log(`✅ Generated ${routes.length} endpoints to ${outputFile}`);
}

try {
	const routes = getRoutes(ROUTES_DIR);
	writeEndpointsFile(routes, OUTPUT_FILE);
}
catch (err) {
	console.error("❌ Failed to generate endpoints file:", err);
	process.exit(1);
}
