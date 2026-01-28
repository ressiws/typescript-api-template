/**
 * @file test-validate.ts
 * @description Test validation route
 * @version 1.0.0
 *
 * Copyright (c) 2025 swisser
 */

import { sendSuccess } from "../core/helpers/response.helper.js";
import { validate } from "../security/validate.middleware.js";
import type { Router } from "express";
import express from "express";
import { z } from "zod";

const router: Router = express.Router();

/**
 * @route POST /test-validate
 * @description Test route to ensure Zod validation middleware works correctly.
 *              Validates body and query parameters, returns errors automatically if invalid.
 */
router.post("/", validate({
	body: z.object({
		name: z.string().min(1, "Name is required"),
		age: z.number().int().min(0, "Age must be a non-negative integer"),
	}),
}), (req, res) => {
	// If we reach here, validation passed
	sendSuccess(res, "Validation passed.", {
		body: req.body,
		query: req.query,
	});
});

export default router;
