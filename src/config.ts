/**
 * @file config.ts
 * @description Contains both general and builder-specific configurations.
 * @version 1.0.0
 */

export const config = {
	/** Clears previous build before compiling */
	force_clean_build: false,

	/** Debug mode */
	maintenance: false,

	api_port: "2001",
	api_token: "",
	api_base_url: "",

	block_via_ip: true,
	require_token: false,
	allowed_ips: ["127.0.0.1"],
};

config.api_base_url = `http://localhost:${config.api_port}`;