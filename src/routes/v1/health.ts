import { createRouter } from "../../routing/router.js";
import { NotFoundError } from "../../errors/appError.js";

export const router = createRouter();

router.get("/", async () => {
	return { status: "ok" };
});

router.post("/", async () => {
	return { status: 201, data: { status: "created" } };
});

router.get("/:id", async (request) => {
	const { id } = request.params as { id: string };

	if (id === "not-found") {
		throw new NotFoundError("Resource not found");
	}

	return { id };
});