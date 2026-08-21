export type NodeEnvironment =
	| "development"
	| "production"
	| "test";

export interface RateLimitConfig {
	windowMs: number;
	max: number;
}

export interface EnvConfig {
	NODE_ENV: NodeEnvironment;
	HOST: string;
	PORT: number;
	CORS_ORIGINS: string[];
}

export interface AppConfig {
	env: EnvConfig;
	app: {
		name: string;
		version: string;
	};
	rateLimit: RateLimitConfig;
}
