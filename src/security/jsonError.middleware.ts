import type { NextFunction, Request, Response } from "express";
import { sendError } from "../core/helpers/response.helper.js";

export function jsonErrorMiddleware(
	err: unknown,
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (typeof err === "object" && err !== null && "type" in err) {
		const type = (err as { type?: unknown }).type;

		if (type === "entity.parse.failed")
			return sendError(res, "INVALID_JSON", 400);

		if (type === "entity.too.large")
			return sendError(res, "PAYLOAD_TOO_LARGE", 413);
	}

	next(err);
}
