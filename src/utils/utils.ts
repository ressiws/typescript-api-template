import path from "path";
import { fileURLToPath } from "url";

export function makeLocations(ImportMetaUrl: string) {
	const _filename = fileURLToPath(ImportMetaUrl);
	const _currentdir = path.dirname(_filename);
	const _dirname = path.resolve(_currentdir, "..");

	return { dirname: _dirname };
}

export const { dirname: __dirname } = makeLocations(import.meta.url);

export function getUnixTimestamp(value?: number | Date) {
	return value ? Math.floor(new Date(value).getTime() / 1000) : Math.floor(Date.now() / 1000);
}