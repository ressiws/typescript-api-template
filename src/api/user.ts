import { Endpoints } from "@utils/route-loader.js";
import { Request, Response } from "express";

export default class UserEndpoint extends Endpoints {
	constructor() {
		super();
		this.name = "user";
		this.description = "Return a specific user data.";
		this.params = ["user_id"]; // Optional dynamic params in the URL
		this.version = "1.0.0";
		this.private = false; // true = requires token/IP access
	}

	public async endpoint(req: Request, res: Response): Promise<void> {
		const { user_id } = req.params;
		if (!user_id) {
			res.status(404).json({ error: "User id not found." });
			return;
		}

		res.status(200).json({ user_id, name: "John Doe" });
	}
}