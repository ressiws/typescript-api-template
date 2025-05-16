import { fileURLToPath } from "url";
import { Request } from "express";
import path from "path";

export function makeLocations(importMetaUrl: string) {
	const _filename = fileURLToPath(importMetaUrl);
	const _currentDir = path.dirname(_filename);
	const _dirname = path.resolve(_currentDir, "..");

	return { filename: _filename, dirname: _dirname };
}

export const { dirname: __dirname } = makeLocations(import.meta.url);

export async function getIPv4(req: Request): Promise<string> {
	const ip = req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "";
	const clean_ip = ip.replace("::ffff:", "").replace("::1", "127.0.0.1");

	return clean_ip || "unknown_ip";
}