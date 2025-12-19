/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from "express";

export function jsonErrorMiddleware(
	err: any,
	_req: Request,
	res: Response,
	next: NextFunction
) {
	if (err?.type === "entity.parse.failed") {
		return res.status(400).json({
			status: "error",
			code: "INVALID_JSON",
			message: "Malformed JSON body",
			data: null
		});
	}

	if (err?.type === "entity.too.large") {
		return res.status(413).json({
			status: "error",
			code: "PAYLOAD_TOO_LARGE",
			message: "Request body too large",
			data: null
		});
	}

	next(err);
}
