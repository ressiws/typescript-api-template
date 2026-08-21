import type { AppConfig } from "../types/config.js";
import { validateEnv } from "./env.js";

let activeConfig: AppConfig | null = null;

export function loadConfig(): AppConfig {
	if (activeConfig) {
		return activeConfig;
	}

	activeConfig = {
		env: validateEnv(),

		app: {
			name: "api",
			version: "1.0.0",
		},

		rateLimit: {
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 3, // limit each IP to 100 requests per windowMs
		},
	};

	return activeConfig;
}

export const config = loadConfig();