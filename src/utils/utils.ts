import path from "path";
import { fileURLToPath } from "url";

export function makeLocations(ImportMetaUrl: string) {
	const _filename = fileURLToPath(ImportMetaUrl);
	const _currentdir = path.dirname(_filename);
	const _dirname = path.resolve(_currentdir, "..");

	return { dirname: _dirname };
}

export const { dirname: __dirname } = makeLocations(import.meta.url);

export function normalizeIp(ip?: string | null): string {
	if (!ip) return "";

	// Express may return IPv4-mapped IPv6 addresses like ::ffff:127.0.0.1
	if (ip.startsWith("::ffff:")) return ip.slice("::ffff:".length);

	return ip;
}

export function getUnixTimestamp(value?: number | Date) {
	if (value === undefined) return Math.floor(Date.now() / 1000);

	if (value instanceof Date) return Math.floor(value.getTime() / 1000);

	// When a number is provided, treat it as seconds by default (MySQL UNIX_TIMESTAMP).
	// If it looks like milliseconds (13+ digits), convert to seconds.
	if (value > 1_000_000_000_000) return Math.floor(value / 1000);

	return Math.floor(value);
}
