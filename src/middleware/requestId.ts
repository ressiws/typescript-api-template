import type { FastifyInstance } from "fastify";

export async function registerRequestId(app: FastifyInstance): Promise<void> {
	app.addHook("onSend", async (request, reply) => {
		reply.header("X-Request-ID", request.id);
	});
}