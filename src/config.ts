/**
 * @file config.ts
 * @description Contains both general and builder-specific configurations.
 * @version 1.0.0
 */

export const config = {
	/** If true, the API runs in debug mode and may block certain endpoints */
	maintenance: false,

	/** Port where the API will be hosted */
	api_port: "2001",

	/** Bearer token required for authorized requests (if enabled) */
	api_token: "",

	/** Base URL for the API (auto-generated below) */
	api_base_url: "",

	/** If true, blocks any IPs not explicitly listed in `allowed_ips` (only if the endpoint is private)*/
	block_via_ip: true,

	/** If true, requires a valid bearer token for access to protected endpoints (only if the endpoint is private) */
	require_token: false,

	/** Whitelisted IPs allowed to access the API when `block_via_ip` is true */
	allowed_ips: [""],
};

// Auto-generate the base URL based on the selected port
config.api_base_url = `http://localhost:${config.api_port}`;