import helmet from "@fastify/helmet";
import type { FastifyInstance } from "fastify";

export async function registerHeaders(app: FastifyInstance): Promise<void> {
	await app.register(helmet);
}