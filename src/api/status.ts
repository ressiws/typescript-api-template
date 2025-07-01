/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, Request, Response } from "express";
import type { EndpointMeta } from "@utils/route-loader.js";

export const config: EndpointMeta = {
	name: "status",
	description: "Returns API status",
	version: "1.0.0",
	private: true,
};

const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		service: `https://github.com/ressiws`,
		version: `1.0.0`,
		online: true,
		uptime: `${Math.floor(process.uptime())}s`,
		platform: process.platform,
	});
});

export default router;