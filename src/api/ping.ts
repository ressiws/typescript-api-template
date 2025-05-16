/* eslint-disable @typescript-eslint/no-unused-vars */
import { Endpoints } from "@utils/route-loader.js";
import { Request, Response } from "express";

export default class PingEndpoint extends Endpoints {
	constructor() {
		super();
		this.name = "ping";
		this.description = "Replies with 'Pong!'.";
		this.params = [];
		this.version = "1.0.0";
		this.private = false;
	}

	public async endpoint(req: Request, res: Response): Promise<void> {
		res.json("Pong!");
	}
}