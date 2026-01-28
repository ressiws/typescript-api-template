/**
 * @file http.service.ts
 * @description Axios wrapper with default headers and error handling
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";
import { logger } from "../logger.js";

export async function httpRequest<T>(url: string, config?: AxiosRequestConfig): Promise<T | null> {
	try {
		const res: AxiosResponse<T> = await axios({ url, ...config });
		return res.data;
	}
	catch (err: unknown) {
		const message = err instanceof Error ? err.message : String(err);
		logger.error(`HTTP request failed: ${message}`);
		return null;
	}
}
