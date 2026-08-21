import { createRouter } from "../../routing/router.js";

export const router = createRouter();

router.get("/", async () => {
	return {
		status: "ok",
	};
});

router.post("/", async () => {
	return {
		status: "created",
	};
});

router.get("/:id", async (request) => {
	const { id } = request.params as { id: string };

	return {
		id,
	};
});